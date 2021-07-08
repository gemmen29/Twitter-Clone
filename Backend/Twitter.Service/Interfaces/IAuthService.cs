using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twitter.Data.DTOs;

namespace Twitter.Service.Interfaces
{
    public interface IAuthService
    {
        Task<AuthModel> RegisterAsync(RegisterModel model);
        Task<AuthModel> LoginAsync(LoginModel model);
        Task<string> AddRoleAsync(AddRoleModel model);
        Task<AuthModel> ConfirmEmailAsync(string userId, string token);
        Task<AuthModel> ForgetPasswordAsync(ForgotPasswordModel forgotPasswordModel);
        Task<AuthModel> ResetPasswordAsync(ResetPasswordModel model);
        Task<UserDetails> GetCurrentUser(string userID);
        Task<AuthModel> UpdateAsync(string userID, UpdateUserModel model);
        Task<string> GetUserID(string userName);
    }
}
