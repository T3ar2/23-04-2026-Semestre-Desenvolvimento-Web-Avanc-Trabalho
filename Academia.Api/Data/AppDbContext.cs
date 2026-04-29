
using Microsoft.EntityFrameworkCore;
using Academia.Api.Models;

namespace Academia.Api.Data;

public class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
  public DbSet<Aluno> Alunos => Set<Aluno>();
  public DbSet<Exercicio> Exercicios => Set<Exercicio>();
  public DbSet<Treino> Treinos => Set<Treino>();
  public DbSet<Usuario> Usuarios => Set<Usuario>();

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<Aluno>()
  .HasMany(a => a.Treinos)
  .WithOne(t => t.Aluno)
  .HasForeignKey(t => t.AlunoId)
  .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<Usuario>()
          .HasIndex(u => u.Login)
          .IsUnique();
  }
}