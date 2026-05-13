using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academia.Api.Models;

public class PlanoTreino
{
    public int Id { set; get; }

    [Required(ErrorMessage = "O nome do treino é obrigatório")]
    public string? NomeTreino { set; get; }

    [Required(ErrorMessage = "Selecione para qual aluno designará o treino")]
    public int AlunoId { set; get; }
    [ForeignKey("AlunoId")]

    public Aluno? Aluno { set; get; }

     public List<PlanoTreinoItem>? ExerciciosPlanejados { get; set; } 
}