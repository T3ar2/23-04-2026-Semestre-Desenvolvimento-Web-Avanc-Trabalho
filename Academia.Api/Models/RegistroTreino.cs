using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academia.Api.Models;

public class RegistroTreino
{
    public int Id { get; set; }

    [Required(ErrorMessage = "O ID do aluno é obrigatório")]
    public int AlunoId { get; set; }

    [ForeignKey("AlunoId")]
    public Aluno? Aluno { get; set; }

    public int? PlanoTreinoId { get; set; }

    [ForeignKey("PlanoTreinoId")]
    public PlanoTreino? PlanoTreino { get; set; }

    [Required(ErrorMessage = "A data de execução é obrigatória")]
    public DateTime DataExecucao { get; set; }

    public List<ExercicioRealizado> ExerciciosRealizados { get; set; } = new List<ExercicioRealizado>();
}