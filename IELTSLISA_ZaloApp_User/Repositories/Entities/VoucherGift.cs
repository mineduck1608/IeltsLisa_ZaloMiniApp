using System;
using System.Collections.Generic;

namespace Repositories.Entities;

public partial class VoucherGift
{
    public string VoucherId { get; set; } = null!;

    public string GiftId { get; set; } = null!;

    public int Quantity { get; set; }

    public virtual Gift Gift { get; set; } = null!;

    public virtual Voucher Voucher { get; set; } = null!;
}
