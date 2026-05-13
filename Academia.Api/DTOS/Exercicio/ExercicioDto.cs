using System.ComponentModel.DataAnnotations;

namespace Academia.Api.DTOs
{
    public class ExercicioDto
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "O nome é obrigatório.")]
        public string? Nome { get; set; }
        [Required(ErrorMessage = "O grupo muscular é obrigatório.")]
        public string? GrupoMuscular { get; set; }
    }
}
