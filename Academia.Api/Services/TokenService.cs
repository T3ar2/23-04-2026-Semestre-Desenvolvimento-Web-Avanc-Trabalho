
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Academia.Api.Dtos;

using System.Security.Claims;
using System.Text;

namespace Academia.Api.Services;

public class TokenService {
    private readonly IConfiguration _config;

    public TokenService(IConfiguration config) {
        _config = config;
    }

    public string GenerateToken(string username) {
        var jwtKey = _config["Jwt:Key"] ?? throw new InvalidOperationException("A chave JWT não foi configurada.");
        var key = Encoding.UTF8.GetBytes(jwtKey);
        var claims = new[] {
            new Claim(ClaimTypes.Name, username)
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}