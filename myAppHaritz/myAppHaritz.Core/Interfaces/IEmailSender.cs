using System.Threading.Tasks;

namespace myAppHaritz.Core.Interfaces
{
    public interface IEmailSender
    {
        Task SendOtpEmailAsync(string email, string otpCode);
    }
}
