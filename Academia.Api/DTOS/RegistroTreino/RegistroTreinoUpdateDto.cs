using System.ComponentModel.DataAnnotations;

namespace Academia.Api.DTOs;

public class RegistroTreinoUpdateDto
{
    [Required(ErrorMessage = "O ID do aluno é obrigatório")]
    public int AlunoId { get; set; }

    public int? PlanoTreinoId { get; set; }

    [Required(ErrorMessage = "A data de execução é obrigatória")]
    public DateTime DataExecucao { get; set; }

    [Required(ErrorMessage = "A lista de exercícios realizados é obrigatória")]
    public List<ExercicioRealizadoUpdateDto> ExerciciosRealizados { get; set; } = new List<ExercicioRealizadoUpdateDto>();
}