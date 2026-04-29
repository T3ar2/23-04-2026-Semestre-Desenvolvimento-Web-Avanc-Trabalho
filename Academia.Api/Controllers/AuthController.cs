using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static BCrypt.Net.BCrypt;
using Academia.Api.Data;
using Academia.Api.Services;
using Academia.Api.Dtos;

namespace PrimeiraApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase {
    private readonly AppDbContext ctx;
    private readonly TokenService _tokenService;

    public AuthController(AppDbContext context, TokenService tokenService) {
        ctx = context;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto) {

        var usuario = await ctx.Usuarios
            .FirstOrDefaultAsync(u => u.Login == dto.Login);

        if (!Verify(dto.Senha, usuario.SenhaHash))
            return Unauthorized(new { message = "Usuário ou senha inválidos" });

        var token = _tokenService.GenerateToken(usuario.Login);

        return Ok(new {
            token,
            nome = usuario.Nome,
            usuario = usuario.Login
        });
    }    
}