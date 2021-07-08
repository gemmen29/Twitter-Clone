using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Twitter.Data.DTOs;
using Twitter.Service.Interfaces;

namespace Twitter.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IMailService _mailService;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AccountController(IAuthService authService, IMailService mailService, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _authService = authService;
            _mailService = mailService;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync(RegisterModel model) //we don't need [FromModel], attribute [ApiController] will know it without writing it. 
        {
            //if (!ModelState.IsValid) { return BadRequest(ModelState); }       //we don't need this check,  attribute [ApiController] will do it for us and return Modelstate in the result.

            var result = await _authService.RegisterAsync(model);

            if (!result.IsAuthenticated)
                return BadRequest(result.Message);

            return Ok(result);
            //return Ok(new { Email = result.Email, Token = result.Token });    //if you want to return some of the data not all of it.
        }



        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync(LoginModel model)
        {

            var result = await _authService.LoginAsync(model);

            if (!result.IsAuthenticated)
                return BadRequest(result.Message);

            //_mailService.SendEmail(model.Email, "New login", "<h1>Hey!, new login to your account noticed</h1><p>New login to your account at " + DateTime.Now + "</p>");

            return Ok(result);
        }



        [HttpPost("addrole")]
        public async Task<IActionResult> AddRoleAsync(AddRoleModel model)
        {

            var result = await _authService.AddRoleAsync(model);

            if (!string.IsNullOrEmpty(result)) //if it's empty that's mean it's done successufflly. 
                return BadRequest(result);

            return Ok(model);
        }



        // /api/account/ConfirmEmail?userid&token
        [HttpGet("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(token))
                return NotFound();

            var result = await _authService.ConfirmEmailAsync(userId, token);

            if (result.IsAuthenticated)
            {
                return Redirect($"{_configuration["AppUrl"]}/ConfirmEmail.html");
            }

            return BadRequest(result.Message);
        }

        // api/account/forgetpassword
        [HttpPost("ForgetPassword")]
        public async Task<IActionResult> ForgetPassword(ForgotPasswordModel forgotPasswordModel)
        {
            if (string.IsNullOrEmpty(forgotPasswordModel.Email))
                return NotFound();

            var result = await _authService.ForgetPasswordAsync(forgotPasswordModel);

            if (result.IsAuthenticated)
                return Ok(new {Message =  result.Message }); // in success you have to return object not just the message

            return BadRequest(result.Message); // in error you can return just the response 
        }

        // api/account/resetpassword
        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword(ResetPasswordModel model)
        {
            if (ModelState.IsValid)
            {
                var result = await _authService.ResetPasswordAsync(model);

                if (result.IsAuthenticated)
                    return Ok(new { Message = result.Message });

                return BadRequest(result.Message);
            }

            return BadRequest("Some properties are not valid");
        }

        [HttpGet("details")]
        public async Task<IActionResult> CurrentUserDetails()
        {
            var userID = _httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == "uid").Value;
            var result = await _authService.GetCurrentUser(userID);

            if (result == null)
                return BadRequest(new { Message = "UnAuthorized" });

            return Ok(result);
        }
        [HttpGet("details/{username}")]
        public async Task<IActionResult> CurrentUserDetails(string username)
        {
            //var userID = _httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == "uid").Value;
            var userID = _authService.GetUserID(username).Result;
            var result = await _authService.GetCurrentUser(userID);

            if (result == null)
                return BadRequest(new { Message = "UnAuthorized" });

            return Ok(result);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateAsync(UpdateUserModel model)
        {
            var userID = _httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == "uid").Value;
            var result = await _authService.UpdateAsync(userID, model);

            if (!result.IsAuthenticated)
                return BadRequest(new { Message = result.Message });

            return Ok(result);
            
        }
    }
}
