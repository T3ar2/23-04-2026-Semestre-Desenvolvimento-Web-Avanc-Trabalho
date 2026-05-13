using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Academia.Api.Data;
using Academia.Api.DTOs;
using Academia.Api.Models;

namespace Academia.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ExercicioController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExercicioController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var exercicios = await _context.Exercicios
                .Select(e => new ExercicioResponseDto
                {
                    Id = e.Id,
                    Nome = e.Nome,
                    Descricao = e.Descricao,
                    GrupoMuscular = e.GrupoMuscular,
                    Series = e.Series,
                    Repeticoes = e.Repeticoes
                })
                .ToListAsync();

            return Ok(exercicios);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var exercicio = await _context.Exercicios.FindAsync(id);

            if (exercicio == null)
                return NotFound(new { message = "Exercício não encontrado" });

            return Ok(new ExercicioResponseDto
            {
                Id = exercicio.Id,
                Nome = exercicio.Nome,
                Descricao = exercicio.Descricao,
                GrupoMuscular = exercicio.GrupoMuscular,
                Series = exercicio.Series,
                Repeticoes = exercicio.Repeticoes
            });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ExercicioCreateDto dto)
        {
            var exercicio = new Exercicio
            {
                Nome = dto.Nome,
                Descricao = dto.Descricao,
                GrupoMuscular = dto.GrupoMuscular,
                Series = dto.Series,
                Repeticoes = dto.Repeticoes
            };

            _context.Exercicios.Add(exercicio);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = exercicio.Id }, new ExercicioResponseDto
            {
                Id = exercicio.Id,
                Nome = exercicio.Nome,
                Descricao = exercicio.Descricao,
                GrupoMuscular = exercicio.GrupoMuscular,
                Series = exercicio.Series,
                Repeticoes = exercicio.Repeticoes
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ExercicioCreateDto dto)
        {
            var exercicio = await _context.Exercicios.FindAsync(id);

            if (exercicio == null)
                return NotFound(new { message = "Exercício não encontrado" });

            exercicio.Nome = dto.Nome;
            exercicio.Descricao = dto.Descricao;
            exercicio.GrupoMuscular = dto.GrupoMuscular;
            exercicio.Series = dto.Series;
            exercicio.Repeticoes = dto.Repeticoes;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var exercicio = await _context.Exercicios.FindAsync(id);

            if (exercicio == null)
                return NotFound(new { message = "Exercício não encontrado" });

            _context.Exercicios.Remove(exercicio);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
