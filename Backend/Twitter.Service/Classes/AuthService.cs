using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Twitter.Data.DTOs;
using Twitter.Data.Helpers;
using Twitter.Data.Models;
using Twitter.Repository;
using Twitter.Service.Interfaces;

namespace Twitter.Service.Classes
{
    public class AuthService : BaseService, IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IMailService _mailService;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly JWT _jwt;

        public AuthService(UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IOptions<JWT> jwt,
            IMailService mailService,
            IConfiguration configuration,
            ApplicationDbContext context,
            IMapper mapper) : base(mapper)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _mailService = mailService;
            _configuration = configuration;
            _context = context;
            _jwt = jwt.Value;
        }

        public async Task<AuthModel> RegisterAsync(RegisterModel model)
        {
            //Validation For username and Email because they are unique.
            if (await _userManager.FindByEmailAsync(model.Email) is not null)
                return new AuthModel { Message = "Email is already registered!" };
            if (await _userManager.FindByNameAsync(model.Username) is not null)
                return new AuthModel { Message = "Username is already registered!" };

            ApplicationUser user = new ApplicationUser();
            Mapper.Map(model, user);
            user.UserPic = "avatar.png";

            //Register the user using UserManager
            var result = await _userManager.CreateAsync(user, model.Password);


            //if not success return error message
            if (!result.Succeeded)
            {
                var errors = string.Empty;

                foreach (var error in result.Errors)
                    errors += $"{error.Description}";

                return new AuthModel { Message = errors };
            }

            //Here add the user to any Role as your business 
            await _userManager.AddToRoleAsync(user, "User");

            //Function to create Token for this user
            var jwtSecurityToken = await CreateJwtToken(user);


            //For Email Confirmation
            var confirmEmailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            //the identity encoding cause some proplems when you sending it in URL, so we encode it again with way that not makes any problems. 
            var encodedEmailToken = Encoding.UTF8.GetBytes(confirmEmailToken);
            var validEmailToken = WebEncoders.Base64UrlEncode(encodedEmailToken);

            string url = $"{_configuration["AppUrl"]}/api/Account/ConfirmEmail?userid={user.Id}&token={validEmailToken}";

            _mailService.SendEmail(user.Email, "Confirm your email", $"<h1>Welcome to APIWithJWT Demo</h1>" +
                $"<p>Please confirm your email by <a href='{url}'>Clicking here</a></p>");



            //return sucssess result
            return new AuthModel
            {
                Email = user.Email,
                ExpiresOn = jwtSecurityToken.ValidTo,
                IsAuthenticated = true,
                Roles = new List<string> { "User" },
                Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken),
                Username = user.UserName,
                UserPic = user.UserPic,
                FirstName = user.FirstName,
                LastName = user.LastName
            };
        }

        public async Task<AuthModel> LoginAsync(LoginModel model)
        {
            var authModel = new AuthModel();

            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user is null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                authModel.Message = "Email or Password is incorrect!";
                return authModel;
            }

            var jwtSecurityToken = await CreateJwtToken(user);
            var rolesList = await _userManager.GetRolesAsync(user);

            authModel.IsAuthenticated = true;
            authModel.Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
            authModel.Email = user.Email;
            authModel.Username = user.UserName;
            authModel.ExpiresOn = jwtSecurityToken.ValidTo;
            authModel.Roles = rolesList.ToList();
            authModel.UserPic = user.UserPic;
            authModel.FirstName = user.FirstName;
            authModel.LastName = user.LastName;

            return authModel;
        }

        public async Task<string> AddRoleAsync(AddRoleModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);

            if (user is null || !await _roleManager.RoleExistsAsync(model.Role))
                return "Invalid user ID or Role";

            if (await _userManager.IsInRoleAsync(user, model.Role))
                return "User already assigned to this role";

            var result = await _userManager.AddToRoleAsync(user, model.Role);

            return result.Succeeded ? string.Empty : "Sonething went wrong";
        }

        public async Task<AuthModel> ConfirmEmailAsync(string userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return new AuthModel
                {
                    IsAuthenticated = false,
                    Message = "User not found"
                };

            //To decode what we encode.
            var decodedToken = WebEncoders.Base64UrlDecode(token);
            string normalToken = Encoding.UTF8.GetString(decodedToken);

            var result = await _userManager.ConfirmEmailAsync(user, normalToken);

            if (result.Succeeded)
                return new AuthModel
                {
                    Message = "Email confirmed successfully!",
                    IsAuthenticated = true,
                };

            //if not success
            var errors = string.Empty;
            foreach (var error in result.Errors)
                errors += $"{error.Description}";
            return new AuthModel
            {
                IsAuthenticated = false,
                Message = "Email did not confirm, " + errors
            };
        }

        public async Task<AuthModel> ForgetPasswordAsync(ForgotPasswordModel forgotPasswordModel)
        {
            var user = await _userManager.FindByEmailAsync(forgotPasswordModel.Email);
            if (user == null)
                return new AuthModel
                {
                    IsAuthenticated = false,
                    Message = "No user associated with email",
                };

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = Encoding.UTF8.GetBytes(token);
            var validToken = WebEncoders.Base64UrlEncode(encodedToken);

            string url = $"{forgotPasswordModel.ClientURI}?email={forgotPasswordModel.Email}&token={validToken}";

            _mailService.SendEmail(forgotPasswordModel.Email, "Reset Password", "<h1>Follow the instructions to reset your password</h1>" +
                $"<p>To reset your password <a href='{url}'>Click here</a></p>");

            return new AuthModel
            {
                IsAuthenticated = true,
                Message = "Reset password URL has been sent to the email successfully!"
            };
        }

        public async Task<AuthModel> ResetPasswordAsync(ResetPasswordModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return new AuthModel
                {
                    IsAuthenticated = false,
                    Message = "No user associated with email",
                };

            if (model.Password != model.ConfirmPassword)
                return new AuthModel
                {
                    IsAuthenticated = false,
                    Message = "Password doesn't match its confirmation",
                };

            var decodedToken = WebEncoders.Base64UrlDecode(model.Token);
            string normalToken = Encoding.UTF8.GetString(decodedToken);

            var result = await _userManager.ResetPasswordAsync(user, normalToken, model.Password);

            if (result.Succeeded)
                return new AuthModel
                {
                    Message = "Password has been reset successfully!",
                    IsAuthenticated = true,
                };

            //if not success
            var errors = string.Empty;
            foreach (var error in result.Errors)
                errors += $"{error.Description}";
            return new AuthModel
            {
                Message = errors,
                IsAuthenticated = false
            };
        }

        //Function to Create JWT Token
        private async Task<JwtSecurityToken> CreateJwtToken(ApplicationUser user)
        {
            var userClaims = await _userManager.GetClaimsAsync(user);
            var roles = await _userManager.GetRolesAsync(user);
            var roleClaims = new List<Claim>();

            foreach (var role in roles)
                roleClaims.Add(new Claim("roles", role));

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("uid", user.Id)
            }
            .Union(userClaims)
            .Union(roleClaims);

            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key));
            var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

            var jwtSecurityToken = new JwtSecurityToken(
                issuer: _jwt.Issuer,
                audience: _jwt.Audience,
                claims: claims,
                expires: DateTime.Now.AddDays(_jwt.DurationInDays),
                signingCredentials: signingCredentials);

            return jwtSecurityToken;
        }

        public async Task<UserDetails> GetCurrentUser(string userID)
        {
            //var user = await _userManager.FindByIdAsync(userID);
            var user = await _context.Users.Include(u => u.Followers).Include(u => u.Following).FirstOrDefaultAsync(u => u.Id == userID);
            var userDetails = new UserDetails();
            if (user is null)
            {
                return null;
            }
            Mapper.Map(user, userDetails);
            return userDetails;
        }

        public async Task<AuthModel> UpdateAsync(string userID, UpdateUserModel model)
        {

            ApplicationUser user = await _userManager.FindByIdAsync(userID);
            if(user is null) {
                return new AuthModel
                {
                    Message = "Not User With this User ID"
                };
            }
            Mapper.Map(model, user);

            //Register the user using UserManager
            var result = await _userManager.UpdateAsync(user);


            //if not success return error message
            if (!result.Succeeded)
            {
                var errors = string.Empty;

                foreach (var error in result.Errors)
                    errors += $"{error.Description}";

                return new AuthModel { Message = errors };
            }

            return new AuthModel { 
                IsAuthenticated = true,
                Message = "Updated Successfully!" };
        }

        public async Task<string> GetUserID(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            return user.Id;
        }
    }
}
