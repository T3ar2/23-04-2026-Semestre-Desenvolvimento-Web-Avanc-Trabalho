
using Microsoft.EntityFrameworkCore;
using Academia.Api.Models;

namespace Academia.Api.Data;

public class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
  public DbSet<Aluno> Alunos => Set<Aluno>();
  public DbSet<Exercicio> Exercicios => Set<Exercicio>();
  public DbSet<Usuario> Usuarios => Set<Usuario>();
  public DbSet<PlanoTreino> PlanosTreino => Set<PlanoTreino>();

  public DbSet<PlanoTreinoItem> PlanoTreinoItens => Set<PlanoTreinoItem>();

  public DbSet<RegistroTreino> RegistrosTreino => Set<RegistroTreino>();

  public DbSet<ExercicioRealizado> ExerciciosRealizados => Set<ExercicioRealizado>();

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<Aluno>()
  .HasMany(a => a.PlanosTreinos)
  .WithOne(t => t.Aluno)
  .HasForeignKey(t => t.AlunoId)
  .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<Usuario>()
          .HasIndex(u => u.Login)
          .IsUnique();

    modelBuilder.Entity<PlanoTreino>()
    .HasMany(t => t.ExerciciosPlanejados)
    .WithOne(rt => rt.PlanoTreino)
    .HasForeignKey(rt => rt.PlanoTreinoId)
    .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<RegistroTreino>()
    .HasMany(r => r.ExerciciosRealizados)
    .WithOne(e => e.RegistroTreino)
    .HasForeignKey(e => e.RegistroTreinoId)
    .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<RegistroTreino>()
    .HasOne(r => r.Aluno)
    .WithMany()
    .HasForeignKey(r => r.AlunoId)
    .OnDelete(DeleteBehavior.Cascade);

     modelBuilder.Entity<RegistroTreino>()
      .HasOne(r => r.PlanoTreino)
      .WithMany()
      .HasForeignKey(r => r.PlanoTreinoId)
      .OnDelete(DeleteBehavior.SetNull);
  }

}