using System;
using System.Collections.Generic;

namespace Repositories.Entities;

public partial class Class
{
    public string ClassId { get; set; } = null!;

    public string? ClassName { get; set; }

    public string? ClassContent { get; set; }

    public string? ClassImg { get; set; }
}
