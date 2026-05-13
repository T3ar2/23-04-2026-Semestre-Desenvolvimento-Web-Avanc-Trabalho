using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academia.Api.Models;

public class ExercicioRealizado
{
    public int Id { get; set; }

    [Required]
    public int RegistroTreinoId { get; set; }

    [ForeignKey("RegistroTreinoId")]
    public RegistroTreino? RegistroTreino { get; set; }

    [Required]
    public int ExercicioId { get; set; }

    [ForeignKey("ExercicioId")]
    public Exercicio? Exercicio { get; set; }

    public int Series { get; set; }

    public int Repeticoes { get; set; }

    public double Carga { get; set; }
}