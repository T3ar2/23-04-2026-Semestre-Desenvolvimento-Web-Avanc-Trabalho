using System.ComponentModel.DataAnnotations;

namespace Academia.Api.DTOs;

public class PlanoTreinoDto
{
    [Required(ErrorMessage = "O ID do treino é obrigatório")]
    public int Id { get; set; }

    [Required(ErrorMessage = "O nome do treino é obrigatório")]
    public string? NomeTreino { get; set; }

    [Required(ErrorMessage = "O ID do aluno é obrigatório")]
    public int AlunoId { get; set; }

    [Required(ErrorMessage = "A lista de exercícios não pode ser vazia")]
    public List<ExercicioPlanejadoResponseDto> ExerciciosPlanejados { get; set; } = new List<ExercicioPlanejadoResponseDto>();
}
