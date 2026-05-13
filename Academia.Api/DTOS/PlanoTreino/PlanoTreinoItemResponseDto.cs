namespace Academia.Api.DTOs;

public class PlanoTreinoItemResponseDto
{
    public int ExercicioId { get; set; }
    public string? NomeExercicio { get; set; }
    public int Series { get; set; }
    public int Repeticoes { get; set; }
}