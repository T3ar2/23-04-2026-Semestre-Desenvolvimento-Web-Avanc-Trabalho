
using System.ComponentModel.DataAnnotations;

namespace Academia.Api.Models;

public class Usuario
{
    public int Id { get; set; }

    [Required]
    public string? Username { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string? Senha { get; set; }
}