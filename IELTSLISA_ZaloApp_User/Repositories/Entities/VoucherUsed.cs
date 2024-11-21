using System;
using System.Collections.Generic;

namespace Repositories.Entities;

public partial class VoucherUsed
{
    public string VoucherUsedId { get; set; } = null!;

    public string UserId { get; set; } = null!;

    public string VoucherId { get; set; } = null!;

    public DateTime? Redeemed { get; set; }

    public virtual User User { get; set; } = null!;

    public virtual Voucher Voucher { get; set; } = null!;
}
