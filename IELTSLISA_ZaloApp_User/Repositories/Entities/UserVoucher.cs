using System;
using System.Collections.Generic;

namespace Repositories.Entities;

public partial class UserVoucher
{
    public string UserId { get; set; } = null!;

    public string VoucherId { get; set; } = null!;

    public DateTime? ExpireDate { get; set; }

    public bool? UserVoucherStatus { get; set; }

    public virtual User User { get; set; } = null!;

    public virtual Voucher Voucher { get; set; } = null!;
}
