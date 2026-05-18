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
        [Authorize(Roles = "Admin,Professor,Aluno")]
        public async Task<IActionResult> GetAllAsync()
        {
            var exercicios = await _context.Exercicios
                .Select(e => new ExercicioResponseDto
                {
                    Id = e.Id,
                    Nome = e.Nome,
                    GrupoMuscular = e.GrupoMuscular,
                })
                .ToListAsync();

            return Ok(exercicios);
        }

        [HttpGet("{id}", Name = "GetExercicioById")]
        [Authorize(Roles = "Admin,Professor,Aluno")]
        public async Task<IActionResult> GetById(int id)
        {
            var exercicio = await _context.Exercicios.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);

            if (exercicio is null)
                return NotFound("Exercício não encontrado");

            return Ok(new ExercicioResponseDto
            {
                Id = exercicio.Id,
                Nome = exercicio.Nome,
                GrupoMuscular = exercicio.GrupoMuscular,
            });
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Professor")]        public async Task<IActionResult> Create(ExercicioCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var exercicio = new Exercicio
            {
                Nome = dto.Nome,
                GrupoMuscular = dto.GrupoMuscular,
            };

            _context.Exercicios.Add(exercicio);
            await _context.SaveChangesAsync();



            var result = new ExercicioDto
            {
                Id = exercicio.Id,
                Nome = exercicio.Nome,
                GrupoMuscular = exercicio.GrupoMuscular,
            };

            return CreatedAtRoute("GetExercicioById", new { id = exercicio.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Professor")]
        public async Task<IActionResult> UpdateAsync(int id, ExercicioUpdateDto dto)
        {
            var exercicio = await _context.Exercicios.FindAsync(id);

            if (exercicio is null)
                return NotFound("Exercício não encontrado");

            exercicio.Nome = dto.Nome;
            exercicio.GrupoMuscular = dto.GrupoMuscular;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin,Professor")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var exercicio = await _context.Exercicios.FindAsync(id);

            if (exercicio is null)
                return NotFound("Exercício não encontrado");

            _context.Exercicios.Remove(exercicio);
            await _context.SaveChangesAsync();
            
            return NoContent();
        }
    }
}
