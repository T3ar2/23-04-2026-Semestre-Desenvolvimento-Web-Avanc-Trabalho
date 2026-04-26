
namespace Academia.Api.DTOs;

public class TreinoDto
{
    public int Id { get; set; }
    public string? NomeTreino { get; set; }
    public string? NomeExercicio { get; set; } 
    public int Series { get; set; }
    public int Repeticoes { get; set; }
}