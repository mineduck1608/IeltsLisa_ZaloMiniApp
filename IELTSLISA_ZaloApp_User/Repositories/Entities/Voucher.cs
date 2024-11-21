using System;
using System.Collections.Generic;

namespace Repositories.Entities;

public partial class Voucher
{
    public string VoucherId { get; set; } = null!;

    public string VoucherCode { get; set; } = null!;

    public string VoucherName { get; set; } = null!;

    public string VoucherDescription { get; set; } = null!;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public bool VoucherStatus { get; set; }

    public bool IsDelete { get; set; }

    public virtual ICollection<UserVoucher> UserVouchers { get; set; } = new List<UserVoucher>();

    public virtual ICollection<VoucherGift> VoucherGifts { get; set; } = new List<VoucherGift>();

    public virtual ICollection<VoucherUsed> VoucherUseds { get; set; } = new List<VoucherUsed>();
}
