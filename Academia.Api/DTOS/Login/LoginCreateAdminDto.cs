namespace Academia.Api.Models;

public class LoginCreateAdminDto
{
    public string Login { get; set; } = string.Empty;
    public string SenhaHash { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;

    public string Role { get; set; } = "Aluno";

}