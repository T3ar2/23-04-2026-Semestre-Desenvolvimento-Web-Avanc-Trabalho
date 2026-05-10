using Academia.Api.Data;
using Academia.Api.Dtos;
using Academia.Api.Models;
using Academia.Api.Services;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static BCrypt.Net.BCrypt;

namespace PrimeiraApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{
    private readonly AppDbContext ctx;

    public LoginController(AppDbContext context)
    {
        ctx = context;
    }

    [HttpPost]
    public async Task<ActionResult<Usuario>> CreateAsync(LoginCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.SenhaHash);

        var usuario = new Usuario
        {
            Login = dto.Login,
            SenhaHash = passwordHash,
            Nome = dto.Nome,
        };

        ctx.Usuarios.Add(usuario);
        await ctx.SaveChangesAsync();

        var result = new LoginResultDto
        {
            Nome = usuario.Nome,
        };

        return CreatedAtRoute("GetAlunoById", new { id = usuario.Id }, result);
    }

    [HttpPost]
    public async Task<ActionResult<Usuario>> CreateAsync(LoginCreateAdminDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var usuario = new Usuario
        {
            Nome = dto.Nome,
            Login = dto.Login,
            SenhaHash = dto.SenhaHash,
            Role = dto.Role
        };
        ctx.Usuarios.Add(usuario);
        await ctx.SaveChangesAsync();

        var result = new LoginDto
        {
            Login = dto.Login
        };

        return CreatedAtRoute("GetAlunoById", new { id = usuario.Id }, result);
    }
}