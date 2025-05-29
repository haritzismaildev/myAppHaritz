using System.Threading.Tasks;
using myAppHaritz.Core.Interfaces;

namespace myAppHaritz.Application.Services
{
    public class AuthenticationService
    {
        private readonly IEmailSender _emailSender;
        // Dependencies lain bisa ditambahkan

        public AuthenticationService(IEmailSender emailSender)
        {
            _emailSender = emailSender;
        }

        public async Task SendOtpAsync(string email)
        {
            // Generate OTP (contoh sederhana)
            var otpCode = new Random().Next(100000, 999999).ToString();

            // Simpan OTP ke database atau cache apabila diperlukan untuk verifikasi

            await _emailSender.SendOtpEmailAsync(email, otpCode);

            // Kembalikan atau simpan OTP untuk kebutuhan verifikasi (misalnya di database)
        }
    }
}