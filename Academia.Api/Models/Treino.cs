using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academia.Api.Models
{
    public class Treino
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Nome é obrigatório")]
        [MaxLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "Data é obrigatória")]
        public DateTime Data { get; set; } = DateTime.UtcNow;

        [Required(ErrorMessage = "Aluno é obrigatório")]
        public int AlunoId { get; set; }

        [ForeignKey("AlunoId")]
        public Aluno? Aluno { get; set; }

        public ICollection<TreinoExercicio> TreinosExercicios { get; set; } = new List<TreinoExercicio>();
    }
}
