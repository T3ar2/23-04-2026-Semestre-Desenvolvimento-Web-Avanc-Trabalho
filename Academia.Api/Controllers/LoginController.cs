using Academia.Api.Data;
using Academia.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace Academia.Api.Controllers;

[AllowAnonymous]
[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{
    private readonly AppDbContext ctx;

    public LoginController(AppDbContext context)
    {
        ctx = context;
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<ActionResult<Usuario>> CreateAsync(LoginCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var rolesValidas = new[] { "Admin", "Aluno", "Professor" };

        if (!rolesValidas.Contains(dto.Role.Trim()))
        {
            return BadRequest("Role inválida. Escolha entre: Admin, Aluno ou Professor.");
        }

        string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.SenhaHash);

        var usuario = new Usuario
        {
            Login = dto.Login,
            SenhaHash = passwordHash,
            Nome = dto.Nome,
            Role = dto.Role,
        };

        ctx.Usuarios.Add(usuario);
        await ctx.SaveChangesAsync();

        var result = new LoginResultDto
        {
            Nome = usuario.Nome,
        };

        return Ok("Usuario criado com sucesso");
    }
}