using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Repositories.Entities;

namespace Repositories;

public partial class IeltsLisaContext : DbContext
{
    public IeltsLisaContext()
    {
    }

    public IeltsLisaContext(DbContextOptions<IeltsLisaContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Gift> Gifts { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserVoucher> UserVouchers { get; set; }

    public virtual DbSet<Voucher> Vouchers { get; set; }

    public virtual DbSet<VoucherGift> VoucherGifts { get; set; }

    public virtual DbSet<VoucherUsed> VoucherUseds { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
       => optionsBuilder.UseSqlServer(GetConnectionString());

    private string? GetConnectionString()
    {
        IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", true, true).Build();
        return configuration["ConnectionStrings:DBDefault"];
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Gift>(entity =>
        {
            entity.HasKey(e => e.GiftId).HasName("PK__Gift__4A40E6054ED9837A");

            entity.ToTable("Gift");

            entity.Property(e => e.GiftId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.GiftName)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__User__1788CC4CADA06C5F");

            entity.ToTable("User");

            entity.HasIndex(e => e.Phone, "UQ__User__5C7E359E76E49C1A").IsUnique();

            entity.Property(e => e.UserId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.UserName).HasMaxLength(50);
        });

        modelBuilder.Entity<UserVoucher>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.VoucherId }).HasName("PK__UserVouc__14262BDE0B582599");

            entity.ToTable("UserVoucher");

            entity.Property(e => e.UserId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.VoucherId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ExpireDate).HasColumnType("datetime");

            entity.HasOne(d => d.User).WithMany(p => p.UserVouchers)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__UserVouch__UserI__59FA5E80");

            entity.HasOne(d => d.Voucher).WithMany(p => p.UserVouchers)
                .HasForeignKey(d => d.VoucherId)
                .HasConstraintName("FK__UserVouch__Vouch__5AEE82B9");
        });

        modelBuilder.Entity<Voucher>(entity =>
        {
            entity.HasKey(e => e.VoucherId).HasName("PK__Voucher__3AEE79212A3B1392");

            entity.ToTable("Voucher");

            entity.HasIndex(e => e.VoucherCode, "UQ__Voucher__7F0ABCA9D7A57DC4").IsUnique();

            entity.Property(e => e.VoucherId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EndDate).HasColumnType("datetime");
            entity.Property(e => e.StartDate).HasColumnType("datetime");
            entity.Property(e => e.VoucherCode)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.VoucherName).HasMaxLength(100);
        });

        modelBuilder.Entity<VoucherGift>(entity =>
        {
            entity.HasKey(e => new { e.VoucherId, e.GiftId }).HasName("PK__VoucherG__7E4A77417DFFD7CF");

            entity.ToTable("VoucherGift");

            entity.Property(e => e.VoucherId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.GiftId)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Gift).WithMany(p => p.VoucherGifts)
                .HasForeignKey(d => d.GiftId)
                .HasConstraintName("FK__VoucherGi__GiftI__52593CB8");

            entity.HasOne(d => d.Voucher).WithMany(p => p.VoucherGifts)
                .HasForeignKey(d => d.VoucherId)
                .HasConstraintName("FK__VoucherGi__Vouch__5165187F");
        });

        modelBuilder.Entity<VoucherUsed>(entity =>
        {
            entity.HasKey(e => e.VoucherUsedId).HasName("PK__VoucherU__3FBEAD32D3D2E888");

            entity.ToTable("VoucherUsed");

            entity.Property(e => e.VoucherUsedId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Redeemed)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UserId)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("UserID");
            entity.Property(e => e.VoucherId)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("VoucherID");

            entity.HasOne(d => d.User).WithMany(p => p.VoucherUseds)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__VoucherUs__UserI__5629CD9C");

            entity.HasOne(d => d.Voucher).WithMany(p => p.VoucherUseds)
                .HasForeignKey(d => d.VoucherId)
                .HasConstraintName("FK__VoucherUs__Vouch__571DF1D5");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
