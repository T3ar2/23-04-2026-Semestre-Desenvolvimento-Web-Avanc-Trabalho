using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academia.Api.Models;

public class Treino
{
    public int Id { set; get; }
    [Required(ErrorMessage = "o nome do treino é onrigatóiro")]
    public string? NomeTreino { set; get; }
    [Required]
    public int AlunoId { set; get; }
    [ForeignKey("AlunoId")]
    public Aluno? Aluno { set; get; }
    [Required]
    public int ExercicioId{ set; get; }
    [ForeignKey("ExercicioId")]
    public Exercicio? Exercicio { set; get; }
    public int Series { set; get; }
    public int Repeticoes { set; get; } 
     public List<Exercicio>? Exercicios { get; set; } 
}