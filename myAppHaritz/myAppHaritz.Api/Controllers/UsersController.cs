using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Data.SqlClient;

namespace myAppHaritz.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IConfiguration _config;

        public UsersController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            List<UserDto> users = new List<UserDto>();
            using var conn = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            var query = "SELECT * FROM vw_User";
            using var cmd = new SqlCommand(query, conn);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                users.Add(new UserDto
                {
                    Id = reader["Id"].ToString() ?? "",
                    Name = reader["Name"].ToString() ?? "",
                    Email = reader["Email"].ToString() ?? "",
                    PhoneNumber = reader["PhoneNumber"]?.ToString(),
                    Status = reader["Status"].ToString() ?? "",
                    CreatedAt = Convert.ToDateTime(reader["CreatedAt"]),
                    UpdatedAt = reader["UpdatedAt"] == DBNull.Value ? null : (DateTime?)reader["UpdatedAt"]
                });
            }
            return Ok(users);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserRequest request)
        {
            using var conn = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            using var cmd = new SqlCommand("usp_UpdateUser", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Id", id);
            cmd.Parameters.AddWithValue("@Name", request.Name);
            cmd.Parameters.AddWithValue("@Email", request.Email);
            cmd.Parameters.AddWithValue("@PhoneNumber", string.IsNullOrEmpty(request.PhoneNumber) ? DBNull.Value : request.PhoneNumber);

            if (!string.IsNullOrEmpty(request.Password))
            {
                if (request.Password != request.ConfirmPassword)
                    return BadRequest("Password dan re-entry tidak cocok.");
                var newHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
                cmd.Parameters.AddWithValue("@PasswordHash", newHash);
            }
            else
            {
                cmd.Parameters.AddWithValue("@PasswordHash", DBNull.Value);
            }
            cmd.Parameters.AddWithValue("@Status", request.Status);

            await conn.OpenAsync();
            await cmd.ExecuteNonQueryAsync();

            return Ok("User berhasil diperbarui.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            using var conn = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            using var cmd = new SqlCommand("usp_DeleteUser", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Id", id);

            await conn.OpenAsync();
            await cmd.ExecuteNonQueryAsync();

            return Ok("User berhasil dihapus.");
        }
    }

    public class UserDto
    {
        public string Id { get; set; } = "";
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public string? PhoneNumber { get; set; }
        public string Status { get; set; } = "";
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class UpdateUserRequest
    {
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public string? PhoneNumber { get; set; }
        public string Password { get; set; } = "";         // Opsional: gunakan bila ingin mengubah password
        public string ConfirmPassword { get; set; } = "";    // Validasi kesesuaian password
        public string Status { get; set; } = "";
    }
}
