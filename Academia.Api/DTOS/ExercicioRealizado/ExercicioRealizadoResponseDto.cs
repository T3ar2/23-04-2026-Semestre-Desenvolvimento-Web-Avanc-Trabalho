namespace Academia.Api.DTOs;

public class ExercicioRealizadoResponseDto
{
    public int ExercicioId { get; set; }
    public string? NomeExercicio { get; set; }
    public int Series { get; set; }
    public int Repeticoes { get; set; }
    public double Carga { get; set; }
}