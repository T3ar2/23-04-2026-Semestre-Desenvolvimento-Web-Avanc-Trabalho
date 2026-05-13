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
    public class AlunoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AlunoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var alunos = await _context.Alunos
                .Include(a => a.Plano)
                .Select(a => new AlunoResponseDto
                {
                    Id = a.Id,
                    Nome = a.Nome,
                    Email = a.Email,
                    Telefone = a.Telefone,
                    DataNascimento = a.DataNascimento,
                    PlanoId = a.PlanoId,
                    PlanoNome = a.Plano != null ? a.Plano.Nome : null
                })
                .ToListAsync();

            return Ok(alunos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var aluno = await _context.Alunos
                .Include(a => a.Plano)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (aluno == null)
                return NotFound(new { message = "Aluno não encontrado" });

            return Ok(new AlunoResponseDto
            {
                Id = aluno.Id,
                Nome = aluno.Nome,
                Email = aluno.Email,
                Telefone = aluno.Telefone,
                DataNascimento = aluno.DataNascimento,
                PlanoId = aluno.PlanoId,
                PlanoNome = aluno.Plano?.Nome
            });
        }

        // Cadastro é público — o aluno precisa se registrar antes de logar
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AlunoCreateDto dto)
        {
            var emailExistente = await _context.Alunos.AnyAsync(a => a.Email == dto.Email);
            if (emailExistente)
                return BadRequest(new { message = "Email já cadastrado" });

            var planoExiste = await _context.Planos.AnyAsync(p => p.Id == dto.PlanoId);
            if (!planoExiste)
                return BadRequest(new { message = "Plano não encontrado" });

            var aluno = new Aluno
            {
                Nome = dto.Nome,
                Email = dto.Email,
                Senha = BCrypt.Net.BCrypt.HashPassword(dto.Senha),
                Telefone = dto.Telefone,
                DataNascimento = dto.DataNascimento,
                PlanoId = dto.PlanoId
            };

            _context.Alunos.Add(aluno);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = aluno.Id }, new AlunoResponseDto
            {
                Id = aluno.Id,
                Nome = aluno.Nome,
                Email = aluno.Email,
                Telefone = aluno.Telefone,
                DataNascimento = aluno.DataNascimento,
                PlanoId = aluno.PlanoId
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AlunoUpdateDto dto)
        {
            var aluno = await _context.Alunos.FindAsync(id);

            if (aluno == null)
                return NotFound(new { message = "Aluno não encontrado" });

            var planoExiste = await _context.Planos.AnyAsync(p => p.Id == dto.PlanoId);
            if (!planoExiste)
                return BadRequest(new { message = "Plano não encontrado" });

            aluno.Nome = dto.Nome;
            aluno.Telefone = dto.Telefone;
            aluno.PlanoId = dto.PlanoId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var aluno = await _context.Alunos.FindAsync(id);

            if (aluno == null)
                return NotFound(new { message = "Aluno não encontrado" });

            _context.Alunos.Remove(aluno);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
