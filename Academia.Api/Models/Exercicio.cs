
using System.ComponentModel.DataAnnotations;

namespace Academia.Api.Models;

public class Exercicio
{
    public int Id {get; set;}
    [Required(ErrorMessage = "O nome é obrigatório.")]
    public string? Nome {get; set;}
    [StringLength(1000, MinimumLength = 3, ErrorMessage = "A descrição deve ter entre 3 e 1000 caracteres.")]
    public string? GrupoMuscular {get; set;}
}