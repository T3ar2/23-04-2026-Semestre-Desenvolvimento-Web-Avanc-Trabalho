
using System.ComponentModel.DataAnnotations;

namespace Academia.Api.DTOs
{
    public class ExercicioCreateDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [MaxLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "Grupo muscular é obrigatório")]
        [MaxLength(100, ErrorMessage = "Grupo muscular deve ter no máximo 100 caracteres")]
        public string GrupoMuscular { get; set; } = string.Empty;

    }
}

