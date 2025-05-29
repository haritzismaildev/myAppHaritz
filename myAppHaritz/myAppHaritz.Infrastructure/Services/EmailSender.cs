using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using myAppHaritz.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using myAppHaritz.Infrastructure.Configurations;

namespace myAppHaritz.Infrastructure.Services
{
    public class EmailSender : IEmailSender
    {

        private readonly SmtpSettings _smtpSettings;

        // Konstruktor mengambil IConfiguration lalu mengkonversinya ke SmtpSettings
        public EmailSender(IConfiguration configuration)
        {
            _smtpSettings = configuration.GetSection("Smtp").Get<SmtpSettings>();
        }

        public async Task SendOtpEmailAsync(string email, string otpCode)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("MyAppHaritz", _smtpSettings.Username));
            message.To.Add(new MailboxAddress(email, email));
            message.Subject = "Your OTP Code";

            message.Body = new TextPart("plain")
            {
                Text = $"Your OTP code is: {otpCode}"
            };

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync(_smtpSettings.Host, _smtpSettings.Port, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_smtpSettings.Username, _smtpSettings.Password);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
        }

    }
}
