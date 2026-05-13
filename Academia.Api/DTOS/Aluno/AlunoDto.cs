using System.ComponentModel.DataAnnotations;

namespace Academia.Api.DTOs
{
    public class AlunoCreateDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [MaxLength(150, ErrorMessage = "Nome deve ter no máximo 150 caracteres")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email é obrigatório")]
        [EmailAddress(ErrorMessage = "Email inválido")]
        [MaxLength(150, ErrorMessage = "Email deve ter no máximo 150 caracteres")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Senha é obrigatória")]
        [MinLength(6, ErrorMessage = "Senha deve ter no mínimo 6 caracteres")]
        public string Senha { get; set; } = string.Empty;

        [MaxLength(20, ErrorMessage = "Telefone deve ter no máximo 20 caracteres")]
        public string? Telefone { get; set; }

        [Required(ErrorMessage = "Data de nascimento é obrigatória")]
        public DateTime DataNascimento { get; set; }

        [Required(ErrorMessage = "Plano é obrigatório")]
        public int PlanoId { get; set; }
    }

    public class AlunoUpdateDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [MaxLength(150, ErrorMessage = "Nome deve ter no máximo 150 caracteres")]
        public string Nome { get; set; } = string.Empty;

        [MaxLength(20, ErrorMessage = "Telefone deve ter no máximo 20 caracteres")]
        public string? Telefone { get; set; }

        [Required(ErrorMessage = "Plano é obrigatório")]
        public int PlanoId { get; set; }
    }

    public class AlunoResponseDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Telefone { get; set; }
        public DateTime DataNascimento { get; set; }
        public int PlanoId { get; set; }
        public string? PlanoNome { get; set; }
    }
}
