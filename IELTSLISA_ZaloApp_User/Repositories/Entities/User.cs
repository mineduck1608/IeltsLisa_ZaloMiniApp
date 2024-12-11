using System;
using System.Collections.Generic;

namespace Repositories.Entities;

public partial class User
{
    public string UserId { get; set; } = null!;

    public string UserName { get; set; } = null!;

    public string? Phone { get; set; }

    public virtual ICollection<Concern> Concerns { get; set; } = new List<Concern>();

    public virtual ICollection<UserVoucher> UserVouchers { get; set; } = new List<UserVoucher>();
}
