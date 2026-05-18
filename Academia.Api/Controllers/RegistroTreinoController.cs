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
public class RegistroTreinoController : ControllerBase
{
    private readonly AppDbContext ctx;

    public RegistroTreinoController(AppDbContext context)
    {
        ctx = context;
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Professor,Aluno")]
    public async Task<IActionResult> CreateAsync(RegistroTreinoCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var registroTreino = new RegistroTreino
        {
            AlunoId = dto.AlunoId,
            PlanoTreinoId = dto.PlanoTreinoId,
            DataExecucao = dto.DataExecucao
        };

        foreach (var exercicio in dto.ExerciciosRealizados)
        {
            var exercicioRealizado = new ExercicioRealizado
            {
                ExercicioId = exercicio.ExercicioId,
                Series = exercicio.Series,
                Repeticoes = exercicio.Repeticoes,
                Carga = exercicio.Carga
            };
            
            registroTreino.ExerciciosRealizados.Add(exercicioRealizado);
        }

        ctx.RegistrosTreino.Add(registroTreino);
        await ctx.SaveChangesAsync();

        return Ok(registroTreino.Id);
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Professor")]    public async Task<ActionResult<IEnumerable<RegistroTreinoResponseDto>>> GetAllAsync()
    {
        var registros = await ctx.RegistrosTreino
            .Include(r => r.ExerciciosRealizados)
            .ThenInclude(e => e.Exercicio)
            .AsNoTracking()
            .ToListAsync();

        var result = registros.Select(r => new RegistroTreinoResponseDto
        {
            Id = r.Id,
            AlunoId = r.AlunoId,
            PlanoTreinoId = r.PlanoTreinoId,
            DataExecucao = r.DataExecucao,
            ExerciciosRealizados = r.ExerciciosRealizados.Select(e => new ExercicioRealizadoResponseDto
            {
                ExercicioId = e.ExercicioId,
                NomeExercicio = e.Exercicio!.Nome,
                Series = e.Series,
                Repeticoes = e.Repeticoes,
                Carga = e.Carga
            }).ToList()
        });

        return Ok(result);
    }

    [HttpGet("{id:int}", Name = "GetRegistroTreinoById")]
    [Authorize(Roles = "Admin,Professor,Aluno")]
    public async Task<ActionResult<RegistroTreinoResponseDto>> GetByIdAsync(int id)
    {
        var registro = await ctx.RegistrosTreino
            .Include(r => r.ExerciciosRealizados)
            .ThenInclude(e => e.Exercicio)
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == id);

        if (registro is null)
            return NotFound();

        var result = new RegistroTreinoResponseDto 
        {
            Id = registro.Id,
            AlunoId = registro.AlunoId,
            PlanoTreinoId = registro.PlanoTreinoId,
            DataExecucao = registro.DataExecucao
        };

        foreach (var item in registro.ExerciciosRealizados)
        {
            var exercicioDto = new ExercicioRealizadoResponseDto 
            {
                ExercicioId = item.ExercicioId,
                NomeExercicio = item.Exercicio!.Nome,
                Series = item.Series,
                Repeticoes = item.Repeticoes,
                Carga = item.Carga
            };
            
            result.ExerciciosRealizados.Add(exercicioDto);
        }

        return Ok(result);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,Professor,Aluno")]
    public async Task<IActionResult> UpdateAsync(int id, RegistroTreinoUpdateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var registro = await ctx.RegistrosTreino
            .Include(r => r.ExerciciosRealizados)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (registro is null)
        {
            return NotFound();
        }

        registro.AlunoId = dto.AlunoId;
        registro.PlanoTreinoId = dto.PlanoTreinoId;
        registro.DataExecucao = dto.DataExecucao;

        registro.ExerciciosRealizados.Clear();

        foreach (var item in dto.ExerciciosRealizados)
        {
            var novoItem = new ExercicioRealizado
            {
                ExercicioId = item.ExercicioId,
                Series = item.Series,
                Repeticoes = item.Repeticoes,
                Carga = item.Carga
            };
            
            registro.ExerciciosRealizados.Add(novoItem);
        }

        await ctx.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        var registro = await ctx.RegistrosTreino.FindAsync(id);

        if (registro is null)
            return NotFound();

        ctx.RegistrosTreino.Remove(registro);
        await ctx.SaveChangesAsync();

        return NoContent();
    }
}