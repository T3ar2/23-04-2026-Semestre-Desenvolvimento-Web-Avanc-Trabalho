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
    public class TreinoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TreinoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var treinos = await _context.Treinos
                .Include(t => t.Aluno)
                .Include(t => t.TreinosExercicios)
                    .ThenInclude(te => te.Exercicio)
                .Select(t => new TreinoResponseDto
                {
                    Id = t.Id,
                    Nome = t.Nome,
                    Data = t.Data,
                    AlunoId = t.AlunoId,
                    AlunoNome = t.Aluno != null ? t.Aluno.Nome : null,
                    Exercicios = t.TreinosExercicios
                        .Where(te => te.Exercicio != null)
                        .Select(te => new ExercicioResponseDto
                        {
                            Id = te.Exercicio!.Id,
                            Nome = te.Exercicio.Nome,
                            Descricao = te.Exercicio.Descricao,
                            GrupoMuscular = te.Exercicio.GrupoMuscular,
                            Series = te.Exercicio.Series,
                            Repeticoes = te.Exercicio.Repeticoes
                        }).ToList()
                })
                .ToListAsync();

            return Ok(treinos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var treino = await _context.Treinos
                .Include(t => t.Aluno)
                .Include(t => t.TreinosExercicios)
                    .ThenInclude(te => te.Exercicio)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (treino == null)
                return NotFound(new { message = "Treino não encontrado" });

            return Ok(new TreinoResponseDto
            {
                Id = treino.Id,
                Nome = treino.Nome,
                Data = treino.Data,
                AlunoId = treino.AlunoId,
                AlunoNome = treino.Aluno?.Nome,
                Exercicios = treino.TreinosExercicios
                    .Where(te => te.Exercicio != null)
                    .Select(te => new ExercicioResponseDto
                    {
                        Id = te.Exercicio!.Id,
                        Nome = te.Exercicio.Nome,
                        Descricao = te.Exercicio.Descricao,
                        GrupoMuscular = te.Exercicio.GrupoMuscular,
                        Series = te.Exercicio.Series,
                        Repeticoes = te.Exercicio.Repeticoes
                    }).ToList()
            });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TreinoCreateDto dto)
        {
            var alunoExiste = await _context.Alunos.AnyAsync(a => a.Id == dto.AlunoId);
            if (!alunoExiste)
                return BadRequest(new { message = "Aluno não encontrado" });

            var treino = new Treino
            {
                Nome = dto.Nome,
                Data = dto.Data,
                AlunoId = dto.AlunoId
            };

            _context.Treinos.Add(treino);
            await _context.SaveChangesAsync();

            foreach (var exercicioId in dto.ExercicioIds)
            {
                var exercicioExiste = await _context.Exercicios.AnyAsync(e => e.Id == exercicioId);
                if (!exercicioExiste)
                    return BadRequest(new { message = $"Exercício {exercicioId} não encontrado" });

                _context.TreinosExercicios.Add(new TreinoExercicio
                {
                    TreinoId = treino.Id,
                    ExercicioId = exercicioId
                });
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = treino.Id }, new { treino.Id, treino.Nome });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TreinoCreateDto dto)
        {
            var treino = await _context.Treinos
                .Include(t => t.TreinosExercicios)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (treino == null)
                return NotFound(new { message = "Treino não encontrado" });

            var alunoExiste = await _context.Alunos.AnyAsync(a => a.Id == dto.AlunoId);
            if (!alunoExiste)
                return BadRequest(new { message = "Aluno não encontrado" });

            treino.Nome = dto.Nome;
            treino.Data = dto.Data;
            treino.AlunoId = dto.AlunoId;

            // Remove os exercícios antigos e adiciona os novos
            _context.TreinosExercicios.RemoveRange(treino.TreinosExercicios);

            foreach (var exercicioId in dto.ExercicioIds)
            {
                var exercicioExiste = await _context.Exercicios.AnyAsync(e => e.Id == exercicioId);
                if (!exercicioExiste)
                    return BadRequest(new { message = $"Exercício {exercicioId} não encontrado" });

                _context.TreinosExercicios.Add(new TreinoExercicio
                {
                    TreinoId = treino.Id,
                    ExercicioId = exercicioId
                });
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var treino = await _context.Treinos
                .Include(t => t.TreinosExercicios)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (treino == null)
                return NotFound(new { message = "Treino não encontrado" });

            _context.TreinosExercicios.RemoveRange(treino.TreinosExercicios);
            _context.Treinos.Remove(treino);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
