using System;
using System.Collections.Generic;

namespace Repositories.Entities;

public partial class Information
{
    public string InfoId { get; set; } = null!;

    public string InfoName { get; set; } = null!;

    public string? InfoImg { get; set; }

    public string? InfoContent { get; set; }
}
