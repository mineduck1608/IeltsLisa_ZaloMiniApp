using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace BadmintonCourtAPI.Utils
{
	public class Util
	{

		private static IConfiguration _config = new ConfigurationBuilder()
			.SetBasePath(Directory.GetCurrentDirectory())
			.AddJsonFile("appsettings.json", true, true).Build();
		static readonly HttpClient client = new HttpClient();

		public static string GenerateToken(string id, string username)
		{
			var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
			var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
			if (username.IsNullOrEmpty())
				username = "";
			var claims = new[]
			{
				new Claim("UserId", id.ToString()),
				//new Claim(ClaimTypes.NameIdentifier, username),
				
				new Claim("Username" , username),
				//new Claim(ClaimTypes.Surname, lastName),
			};
			int duration = 15;
			var token = new JwtSecurityToken(
				claims: claims,
				expires: DateTime.Now.AddMinutes(duration),
				signingCredentials: credentials
				);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}
	}
}
