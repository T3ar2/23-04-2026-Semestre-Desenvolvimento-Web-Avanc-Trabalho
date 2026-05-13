using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Academia.Api.Data;
using Academia.Api.DTOs;
using Academia.Api.Services;

namespace Academia.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly TokenService _tokenService;

        public AuthController(AppDbContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var aluno = await _context.Alunos
                .FirstOrDefaultAsync(a => a.Email == dto.Email);

            if (aluno == null || !BCrypt.Net.BCrypt.Verify(dto.Senha, aluno.Senha))
                return Unauthorized(new { message = "Email ou senha inválidos" });

            var token = _tokenService.GenerateToken(aluno);
            return Ok(new { token });
        }
    }
}
