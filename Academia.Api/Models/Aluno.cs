
using System.ComponentModel.DataAnnotations;

namespace Academia.Api.Models;
public class Aluno {
    public int Id {get; set;}

    [Required(ErrorMessage = "O nome é obrigatório.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "O nome deve ter entre 3 e 100 caracteres")]
    public string? Nome {get; set;}

    [Required(ErrorMessage = "O Cpf é obrigatório.")]
    [RegularExpression(@"^\d{3}\.\d{3}\.\d{3}-\d{2}$", ErrorMessage = "Formato de CPF inválido (000.000.000-00)")]
    public string? Cpf {get; set;}
    [Required(ErrorMessage = "O email é obrigatório.")]
    [EmailAddress(ErrorMessage = "O email tem que ser válido.")]
    public string? Email {get; set;}
    public DateTime Nascimento {get; set;}
    public List<Treino> Treinos { get; set; } = new List<Treino>();
}