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
    public class PlanoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PlanoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var planos = await _context.Planos
                .Select(p => new PlanoResponseDto
                {
                    Id = p.Id,
                    Nome = p.Nome,
                    Descricao = p.Descricao,
                    Preco = p.Preco,
                    DuracaoMeses = p.DuracaoMeses
                })
                .ToListAsync();

            return Ok(planos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var plano = await _context.Planos.FindAsync(id);

            if (plano == null)
                return NotFound(new { message = "Plano não encontrado" });

            return Ok(new PlanoResponseDto
            {
                Id = plano.Id,
                Nome = plano.Nome,
                Descricao = plano.Descricao,
                Preco = plano.Preco,
                DuracaoMeses = plano.DuracaoMeses
            });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PlanoCreateDto dto)
        {
            var plano = new Plano
            {
                Nome = dto.Nome,
                Descricao = dto.Descricao,
                Preco = dto.Preco,
                DuracaoMeses = dto.DuracaoMeses
            };

            _context.Planos.Add(plano);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = plano.Id }, new PlanoResponseDto
            {
                Id = plano.Id,
                Nome = plano.Nome,
                Descricao = plano.Descricao,
                Preco = plano.Preco,
                DuracaoMeses = plano.DuracaoMeses
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] PlanoCreateDto dto)
        {
            var plano = await _context.Planos.FindAsync(id);

            if (plano == null)
                return NotFound(new { message = "Plano não encontrado" });

            plano.Nome = dto.Nome;
            plano.Descricao = dto.Descricao;
            plano.Preco = dto.Preco;
            plano.DuracaoMeses = dto.DuracaoMeses;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var plano = await _context.Planos.FindAsync(id);

            if (plano == null)
                return NotFound(new { message = "Plano não encontrado" });

            _context.Planos.Remove(plano);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
