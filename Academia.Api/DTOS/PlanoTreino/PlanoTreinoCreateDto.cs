using System.ComponentModel.DataAnnotations;

namespace Academia.Api.DTOs;

public class PlanoTreinoCreateDto
{
    [Required(ErrorMessage = "O nome do treino é obrigatório")]
    public string? NomeTreino { get; set; }

    [Required(ErrorMessage = "O ID do aluno é obrigatório")]
    public int AlunoId { get; set; }

    [Required(ErrorMessage = "Os exercícios do treino são obrigatórios")]
    public List<ExercicioPlanejadoCreateDto> ExerciciosPlanejados { get; set; } = new List<ExercicioPlanejadoCreateDto>();
}