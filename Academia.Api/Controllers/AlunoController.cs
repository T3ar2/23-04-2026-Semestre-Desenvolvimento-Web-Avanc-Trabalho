using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Academia.Api.Data;
using Academia.Api.Models;
using Academia.Api.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Academia.Api.Controllers;
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AlunoController : ControllerBase {
    private readonly AppDbContext ctx;

    public AlunoController(AppDbContext context) {
        ctx = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AlunoDto>>> GetAllAsync() {
        var alunos = await ctx.Alunos
            .AsNoTracking()
            .ToListAsync();

        var result = alunos.Select(a => new AlunoDto {
            Id = a.Id,
            Nome = a.Nome,
            Cpf = a.Cpf,
            Email = a.Email,
            Nascimento = a.Nascimento
        });

        return Ok(result);
    }

    [HttpGet("{id:int}", Name = "GetAlunoById")]
    public async Task<ActionResult<AlunoDto>> GetByIdAsync(int id) {
        var aluno = await ctx.Alunos
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);

        if (aluno is null)
            return NotFound();

        var result = new AlunoDto {
            Id = aluno.Id,
            Nome = aluno.Nome,
            Cpf = aluno.Cpf,
            Email = aluno.Email,
            Nascimento = aluno.Nascimento
        };

        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<AlunoDto>> CreateAsync(AlunoCreateDto dto) {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var aluno = new Aluno {
            Nome = dto.Nome,
            Cpf = dto.Cpf,
            Email = dto.Email,
            Nascimento = dto.Nascimento
        };
        ctx.Alunos.Add(aluno);
        await ctx.SaveChangesAsync();

        var result = new AlunoDto {
            Id = aluno.Id,
            Nome = aluno.Nome,
            Cpf = aluno.Cpf,
            Email = aluno.Email,
            Nascimento = aluno.Nascimento
        };

        return CreatedAtRoute("GetAlunoById", new { id = aluno.Id }, result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAsync(int id, AlunoUpdateDto dto) {
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
    public async Task<IActionResult> DeleteAsync(int id) {
        var aluno = await ctx.Alunos.FindAsync(id);

        if (aluno is null)
            return NotFound();

        ctx.Alunos.Remove(aluno);
        await ctx.SaveChangesAsync();

        return NoContent();
    }

     [HttpGet("{id:int}/treino")]
    public async Task<ActionResult<AlunoComTreinoDto>> GetAlunoComTreinoAsync(int id) {
        var aluno = await ctx.Alunos
            .Include(a => a.Treinos)
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id);

        if (aluno is null)
            return NotFound();

        var result = new AlunoComTreinoDto {
            Id = aluno.Id,
            Nome = aluno.Nome,
            Cpf = aluno.Cpf,
            Email = aluno.Email,
            Nascimento = aluno.Nascimento,
            Treinos = aluno.Treinos.Select(t => new TreinoDto {
                Id = t.Id,
                NomeTreino = t.NomeTreino,
                // NomeExercicio = t.NomeExercicio, - N sei o pq n esta funcionando
                Series = t.Series,
                Repeticoes = t.Repeticoes
            }).ToList()
        };

        return Ok(result);
    }
}