using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using myAppHaritz.Core.Interfaces;

namespace myAppHaritz.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly string _connectionString;

        private readonly IEmailSender _emailSender;

        private static Dictionary<string, string> _mfaTokens = new Dictionary<string, string>();

        public AuthController(IConfiguration config, IEmailSender emailSender)
        {
            _config = config;
            _connectionString = _config.GetConnectionString("DefaultConnection");
            _emailSender = emailSender;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (request.Password != request.ConfirmPassword)
                return BadRequest("Password dan konfirmasi tidak cocok.");

            // Hash password menggunakan BCrypt
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("usp_CreateUser", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Name", request.Name);
            cmd.Parameters.AddWithValue("@Email", request.Email);
            cmd.Parameters.AddWithValue("@PhoneNumber", string.IsNullOrEmpty(request.PhoneNumber) ? DBNull.Value : request.PhoneNumber);
            cmd.Parameters.AddWithValue("@PasswordHash", passwordHash);
            cmd.Parameters.AddWithValue("@Status", "Active");

            await conn.OpenAsync();
            await cmd.ExecuteNonQueryAsync();

            return Ok("User berhasil didaftarkan. Silahkan login untuk melanjutkan.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                using var conn = new SqlConnection(_connectionString);
                var query = "SELECT TOP 1 * FROM [dbo].[User] WHERE Email = @Email";
                using var cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Email", request.Email);

                await conn.OpenAsync();
                using var reader = await cmd.ExecuteReaderAsync();
                if (!reader.HasRows)
                    return Unauthorized("User tidak ditemukan.");

                await reader.ReadAsync();
                var storedHash = reader["PasswordHash"].ToString();
                if (!BCrypt.Net.BCrypt.Verify(request.Password, storedHash))
                    return Unauthorized("Password salah.");

                // Hasilkan MFA token (kode 6 digit)
                var mfaToken = new Random().Next(100000, 999999).ToString();
                _mfaTokens[request.Email] = mfaToken;

                // Simulasi pengiriman MFA token via email (ganti dengan service email nyata)
                Console.WriteLine($"MFA Token untuk {request.Email}: {mfaToken}");
            }
            catch (Exception ex)
            {
                ex.ToString();
            }

            return Ok(new { message = "MFA token telah dikirim ke email Anda." });
        }

        [HttpPost("verify-mfa")]
        public IActionResult VerifyMFA([FromBody] VerifyMfaRequest request)
        {
            if (!_mfaTokens.ContainsKey(request.Email) || _mfaTokens[request.Email] != request.MfaToken)
                return Unauthorized("MFA token tidak valid.");

            // Jika valid, buat JWT token
            var token = GenerateJwtToken(request.Email);
            _mfaTokens.Remove(request.Email);
            return Ok(new { token });
        }

        private string GenerateJwtToken(string email)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddHours(1);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpRequest request)
        {
            // Generate OTP secara sederhana (contoh: angka 6 digit)
            var otpCode = new Random().Next(100000, 999999).ToString();

            // Sebenarnya, simpan OTP tersebut ke database atau cache untuk verifikasi nanti
            // Lalu, kirim OTP via email
            await _emailSender.SendOtpEmailAsync(request.Email, otpCode);

            return Ok(new { message = $"OTP telah dikirim ke {request.Email}" });
        }
    }

    public class RegisterRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string Password { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class VerifyMfaRequest
    {
        public string Email { get; set; } = string.Empty;
        public string MfaToken { get; set; } = string.Empty;
    }

    public class SendOtpRequest
    {
        public string Email { get; set; }
    }
}
