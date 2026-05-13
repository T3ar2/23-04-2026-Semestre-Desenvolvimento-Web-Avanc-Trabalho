using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academia.Api.Models;

public class PlanoTreinoItem
{
    public int Id { get; set; }
    
    [Required]
    public int PlanoTreinoId { get; set; }
    [ForeignKey("PlanoTreinoId")]
    public PlanoTreino? PlanoTreino { get; set; }
    
    [Required]
    public int ExercicioId { get; set; }
    [ForeignKey("ExercicioId")]
    public Exercicio? Exercicio { get; set; }
    
    public int Series { get; set; }
    public int Repeticoes { get; set; }
}