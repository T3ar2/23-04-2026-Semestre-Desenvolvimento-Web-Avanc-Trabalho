using System.ComponentModel.DataAnnotations;

namespace Academia.Api.Models
{
    public class Exercicio
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Nome é obrigatório")]
        [MaxLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; } = string.Empty;

        [MaxLength(255, ErrorMessage = "Descrição deve ter no máximo 255 caracteres")]
        public string? Descricao { get; set; }

        [Required(ErrorMessage = "Grupo muscular é obrigatório")]
        [MaxLength(100, ErrorMessage = "Grupo muscular deve ter no máximo 100 caracteres")]
        public string GrupoMuscular { get; set; } = string.Empty;

        [Required(ErrorMessage = "Número de séries é obrigatório")]
        [Range(1, 20, ErrorMessage = "Séries deve ser entre 1 e 20")]
        public int Series { get; set; }

        [Required(ErrorMessage = "Número de repetições é obrigatório")]
        [Range(1, 100, ErrorMessage = "Repetições deve ser entre 1 e 100")]
        public int Repeticoes { get; set; }

        public ICollection<TreinoExercicio> TreinosExercicios { get; set; } = new List<TreinoExercicio>();
    }
}
