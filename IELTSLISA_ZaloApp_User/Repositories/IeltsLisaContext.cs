﻿using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
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

    public virtual DbSet<Information> Informations { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserVoucher> UserVouchers { get; set; }

    public virtual DbSet<Voucher> Vouchers { get; set; }

    public virtual DbSet<VoucherGift> VoucherGifts { get; set; }

    public virtual DbSet<VoucherUsed> VoucherUseds { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=ieltslisazaloapp.database.windows.net;Database= IeltsLisa;UID=dangminhduc;PWD=Duc0977300916@;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Gift>(entity =>
        {
            entity.HasKey(e => e.GiftId).HasName("PK__Gift__4A40E605365CE9BE");

            entity.ToTable("Gift");

            entity.Property(e => e.GiftId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.GiftName)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Information>(entity =>
        {
            entity.HasKey(e => e.InfoId).HasName("PK__Informat__4DEC9D9A06524970");

            entity.Property(e => e.InfoId)
                .HasMaxLength(36)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("InfoID");
            entity.Property(e => e.InfoImg).HasMaxLength(2083);
            entity.Property(e => e.InfoName).HasMaxLength(255);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__User__1788CC4C7C75BC99");

            entity.ToTable("User");

            entity.HasIndex(e => e.Phone, "UQ__User__5C7E359E01401941").IsUnique();

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
            entity.HasKey(e => new { e.UserId, e.VoucherId }).HasName("PK__UserVouc__14262BDEE75A3CA4");

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
                .HasConstraintName("FK__UserVouch__UserI__6D0D32F4");

            entity.HasOne(d => d.Voucher).WithMany(p => p.UserVouchers)
                .HasForeignKey(d => d.VoucherId)
                .HasConstraintName("FK__UserVouch__Vouch__6E01572D");
        });

        modelBuilder.Entity<Voucher>(entity =>
        {
            entity.HasKey(e => e.VoucherId).HasName("PK__Voucher__3AEE7921E8EA8C4C");

            entity.ToTable("Voucher");

            entity.HasIndex(e => e.VoucherCode, "UQ__Voucher__7F0ABCA913CD3850").IsUnique();

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
            entity.HasKey(e => new { e.VoucherId, e.GiftId }).HasName("PK__VoucherG__7E4A774110DD9534");

            entity.ToTable("VoucherGift");

            entity.Property(e => e.VoucherId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.GiftId)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Gift).WithMany(p => p.VoucherGifts)
                .HasForeignKey(d => d.GiftId)
                .HasConstraintName("FK__VoucherGi__GiftI__656C112C");

            entity.HasOne(d => d.Voucher).WithMany(p => p.VoucherGifts)
                .HasForeignKey(d => d.VoucherId)
                .HasConstraintName("FK__VoucherGi__Vouch__6477ECF3");
        });

        modelBuilder.Entity<VoucherUsed>(entity =>
        {
            entity.HasKey(e => e.VoucherUsedId).HasName("PK__VoucherU__3FBEAD328FE1FCFF");

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
                .HasConstraintName("FK__VoucherUs__UserI__693CA210");

            entity.HasOne(d => d.Voucher).WithMany(p => p.VoucherUseds)
                .HasForeignKey(d => d.VoucherId)
                .HasConstraintName("FK__VoucherUs__Vouch__6A30C649");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}