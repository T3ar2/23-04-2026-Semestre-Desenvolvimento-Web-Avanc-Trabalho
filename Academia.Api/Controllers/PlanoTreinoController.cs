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
public class PlanoTreinoController : ControllerBase
{
    private readonly AppDbContext ctx;

    public PlanoTreinoController(AppDbContext context)
    {
        ctx = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync(PlanoTreinoCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var planoTreino = new PlanoTreino
        {
            NomeTreino = dto.NomeTreino,
            AlunoId = dto.AlunoId
        };

        foreach (var exercicio in dto.ExerciciosPlanejados)
        {
            var plano = new PlanoTreinoItem
            {
                ExercicioId = exercicio.ExercicioId,
                Series = exercicio.Series,
                Repeticoes = exercicio.Repeticoes
            };
            
            planoTreino.ExerciciosPlanejados!.Add(plano);
        }

        ctx.PlanosTreino.Add(planoTreino);
        await ctx.SaveChangesAsync();

        return Ok(planoTreino.Id);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PlanoTreinoDto>>> GetAllAsync()
    {
        var treinos = await ctx.PlanosTreino
            .Include(t => t.ExerciciosPlanejados!)
            .ThenInclude(r => r.Exercicio)
            .AsNoTracking()
            .ToListAsync();

        var result = treinos.Select(t => new PlanoTreinoDto
        {
            Id = t.Id,
            NomeTreino = t.NomeTreino,
            AlunoId = t.AlunoId,
            ExerciciosPlanejados = t.ExerciciosPlanejados!.Select(r => new ExercicioPlanejadoResponseDto
            {
                ExercicioId = r.ExercicioId,
                NomeExercicio = r.Exercicio?.Nome ?? "Sem nome",
                Series = r.Series,
                Repeticoes = r.Repeticoes
            }).ToList()
        });

        return Ok(result);
    }

    [HttpGet("{id:int}", Name = "GetPlanoTreinoById")]
    public async Task<ActionResult<PlanoTreinoDto>> GetByIdAsync(int id)
    {
        var planoTreino = await ctx.PlanosTreino
            .Include(t => t.ExerciciosPlanejados!)
            .ThenInclude(r => r.Exercicio)
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id);

        if (planoTreino is null)
            return NotFound();

        var result = new PlanoTreinoDto 
        {
            Id = planoTreino.Id,
            NomeTreino = planoTreino.NomeTreino,
            AlunoId = planoTreino.AlunoId
        };

        foreach (var item in planoTreino.ExerciciosPlanejados!)
        {
            var exercicioDto = new ExercicioPlanejadoResponseDto 
            {
                ExercicioId = item.ExercicioId,
                NomeExercicio = item.Exercicio?.Nome ?? "Sem nome",
                Series = item.Series,
                Repeticoes = item.Repeticoes
            };
            
            result.ExerciciosPlanejados.Add(exercicioDto);
        }

        return Ok(result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAsync(int id, PlanoTreinoUpdateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var planoTreino = await ctx.PlanosTreino
            .Include(t => t.ExerciciosPlanejados)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (planoTreino is null)
        {
            return NotFound();
        }

        planoTreino.NomeTreino = dto.NomeTreino;
        planoTreino.AlunoId = dto.AlunoId;

        planoTreino.ExerciciosPlanejados?.Clear();

        foreach (var item in dto.ExerciciosPlanejados)
        {
            var novoItem = new PlanoTreinoItem
            {
                ExercicioId = item.ExercicioId,
                Series = item.Series,
                Repeticoes = item.Repeticoes
            };
            
            planoTreino.ExerciciosPlanejados?.Add(novoItem);
        }

        await ctx.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        var planoTreino = await ctx.PlanosTreino.FindAsync(id);

        if (planoTreino is null)
            return NotFound();

        ctx.PlanosTreino.Remove(planoTreino);
        await ctx.SaveChangesAsync();

        return NoContent();
    }
}