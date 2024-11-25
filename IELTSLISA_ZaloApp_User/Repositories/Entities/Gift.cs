using System;
using System.Collections.Generic;

namespace Repositories.Entities;

public partial class Gift
{
    public string GiftId { get; set; } = null!;

    public string GiftName { get; set; } = null!;

    public string? GiftDescription { get; set; }

    public int GiftQuantity { get; set; }

    public bool GiftStatus { get; set; }

    public virtual ICollection<VoucherGift> VoucherGifts { get; set; } = new List<VoucherGift>();
}
