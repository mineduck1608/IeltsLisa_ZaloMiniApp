using System;
using System.Collections.Generic;

namespace Repositories.Entities;

public partial class User
{
    public string UserId { get; set; } = null!;

    public string UserName { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public virtual ICollection<UserVoucher> UserVouchers { get; set; } = new List<UserVoucher>();

    public virtual ICollection<VoucherUsed> VoucherUseds { get; set; } = new List<VoucherUsed>();
}
