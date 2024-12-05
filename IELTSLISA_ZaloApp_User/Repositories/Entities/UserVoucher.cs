using System;
using System.Collections.Generic;

namespace Repositories.Entities;

public partial class UserVoucher
{
    public string UserId { get; set; } = null!;

    public string VoucherId { get; set; } = null!;

    public bool? UserVoucherStatus { get; set; }

    public DateTime? Redeemed { get; set; }

    public string? GiftId { get; set; }

    public virtual Gift? Gift { get; set; }

    public virtual User User { get; set; } = null!;

    public virtual Voucher Voucher { get; set; } = null!;
}
