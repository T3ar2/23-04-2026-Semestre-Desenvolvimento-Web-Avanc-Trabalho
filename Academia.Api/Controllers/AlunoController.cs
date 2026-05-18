using Microsoft.AspNetCore.Mvc;
using Academia.Api.Data;
using Academia.Api.Models;
using Academia.Api.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Academia.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AlunoController : ControllerBase
{
    private readonly AppDbContext ctx;

    public AlunoController(AppDbContext context)
    {
        ctx = context;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<ActionResult<IEnumerable<AlunoDto>>> GetAllAsync()
    {
        var alunos = await ctx.Alunos
            .AsNoTracking()
            .ToListAsync();

        var result = alunos.Select(a => new AlunoDto
        {
            Id = a.Id,
            Nome = a.Nome,
            Cpf = a.Cpf,
            Email = a.Email,
            Nascimento = a.Nascimento
        });

        return Ok(result);
    }

    [HttpGet("{id:int}", Name = "GetAlunoById")]
    [Authorize(Roles = "Admin,Professor,Aluno")]
    public async Task<ActionResult<AlunoDto>> GetByIdAsync(int id)
    {
        var aluno = await ctx.Alunos
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);

        if (aluno is null)
            return NotFound();

        var result = new AlunoDto
        {
            Id = aluno.Id,
            Nome = aluno.Nome,
            Cpf = aluno.Cpf,
            Email = aluno.Email,
            Nascimento = aluno.Nascimento
        };

        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<ActionResult<AlunoDto>> CreateAsync(AlunoCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var aluno = new Aluno
        {
            Nome = dto.Nome,
            Cpf = dto.Cpf,
            Email = dto.Email,
            Nascimento = dto.Nascimento
        };
        ctx.Alunos.Add(aluno);
        await ctx.SaveChangesAsync();

        var result = new AlunoDto
        {
            Id = aluno.Id,
            Nome = aluno.Nome,
            Cpf = aluno.Cpf,
            Email = aluno.Email,
            Nascimento = aluno.Nascimento
        };

        return CreatedAtRoute("GetAlunoById", new { id = aluno.Id }, result);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,Professor,Aluno")]
    public async Task<IActionResult> UpdateAsync(int id, AlunoUpdateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var aluno = await ctx.Alunos.FindAsync(id);

        if (aluno is null)
            return NotFound();

        aluno.Nome = dto.Nome;
        aluno.Cpf = dto.Cpf;
        aluno.Email = dto.Email;
        aluno.Nascimento = dto.Nascimento;

        await ctx.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        var aluno = await ctx.Alunos.FindAsync(id);

        if (aluno is null)
            return NotFound();

        ctx.Alunos.Remove(aluno);
        await ctx.SaveChangesAsync();

        return NoContent();
    }

    
}