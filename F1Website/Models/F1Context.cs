using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace F1Website.Models;

public partial class F1Context : DbContext
{
    public F1Context()
    {
    }

    public F1Context(DbContextOptions<F1Context> options)
        : base(options)
    {
    }

    public virtual DbSet<Driver> Drivers { get; set; }

    public virtual DbSet<DriverTeam> DriverTeams { get; set; }

    public virtual DbSet<Point> Points { get; set; }

    public virtual DbSet<Race> Races { get; set; }

    public virtual DbSet<Team> Teams { get; set; }

    public virtual DbSet<Track> Tracks { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=F1; User ID=F1User;Password=P@ssw0rd;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Driver>(entity =>
        {
            entity.ToTable("Driver");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Country).HasMaxLength(50);
            entity.Property(e => e.IsVisible).HasDefaultValue(true);
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<DriverTeam>(entity =>
        {
            entity.HasKey(e => new { e.DriverId, e.TeamId });

            entity.ToTable("DriverTeam");

            entity.Property(e => e.DriverId).HasColumnName("DriverID");
            entity.Property(e => e.TeamId).HasColumnName("TeamID");
            entity.Property(e => e.DateFrom).HasColumnType("datetime");
            entity.Property(e => e.DateTo).HasColumnType("datetime");

            entity.HasOne(d => d.Driver).WithMany(p => p.DriverTeams)
                .HasForeignKey(d => d.DriverId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DriverTeam_Driver");

            entity.HasOne(d => d.Team).WithMany(p => p.DriverTeams)
                .HasForeignKey(d => d.TeamId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DriverTeam_Team");
        });

        modelBuilder.Entity<Point>(entity =>
        {
            entity.HasKey(e => new { e.DriverId, e.RaceId });

            entity.Property(e => e.DriverId).HasColumnName("DriverID");
            entity.Property(e => e.RaceId).HasColumnName("RaceID");

            entity.HasOne(d => d.Driver).WithMany(p => p.Points)
                .HasForeignKey(d => d.DriverId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Points_Driver");

            entity.HasOne(d => d.Race).WithMany(p => p.Points)
                .HasForeignKey(d => d.RaceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Points_Race");
        });

        modelBuilder.Entity<Race>(entity =>
        {
            entity.ToTable("Race");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.IsVisible).HasDefaultValue(true);
            entity.Property(e => e.RaceDate).HasColumnType("datetime");
            entity.Property(e => e.TrackId).HasColumnName("TrackID");

            entity.HasOne(d => d.Track).WithMany(p => p.Races)
                .HasForeignKey(d => d.TrackId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Race_Track");
        });

        modelBuilder.Entity<Team>(entity =>
        {
            entity.ToTable("Team");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Engine).HasMaxLength(50);
            entity.Property(e => e.IsVisible).HasDefaultValue(true);
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<Track>(entity =>
        {
            entity.ToTable("Track");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Country).HasMaxLength(50);
            entity.Property(e => e.IsVisible).HasDefaultValue(true);
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
