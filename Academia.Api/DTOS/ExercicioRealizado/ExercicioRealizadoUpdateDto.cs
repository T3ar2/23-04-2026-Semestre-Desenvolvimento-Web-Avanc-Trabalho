using System.ComponentModel.DataAnnotations;

namespace Academia.Api.DTOs;

public class ExercicioRealizadoUpdateDto
{
    [Required(ErrorMessage = "O ID do exercício é obrigatório")]
    public int ExercicioId { get; set; }

    [Required(ErrorMessage = "O número de séries é obrigatório")]
    public int Series { get; set; }

    [Required(ErrorMessage = "O número de repetições é obrigatório")]
    public int Repeticoes { get; set; }

    [Required(ErrorMessage = "A carga utilizada é obrigatória")]
    public double Carga { get; set; }
}