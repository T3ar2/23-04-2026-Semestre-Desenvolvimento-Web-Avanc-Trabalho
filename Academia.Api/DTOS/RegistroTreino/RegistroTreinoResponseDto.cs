namespace Academia.Api.DTOs;

public class RegistroTreinoResponseDto
{
    public int Id { get; set; }
    
    public int AlunoId { get; set; }
    
    public int? PlanoTreinoId { get; set; }
    
    public DateTime DataExecucao { get; set; }
    
    public List<ExercicioRealizadoResponseDto> ExerciciosRealizados { get; set; } = new List<ExercicioRealizadoResponseDto>();
}