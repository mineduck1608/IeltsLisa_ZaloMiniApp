using System;
using System.Collections.Generic;

namespace Repositories.Entities;

public partial class Concern
{
    public string ConcernId { get; set; } = null!;

    public string? UserId { get; set; }

    public string? ClassId { get; set; }

    public bool? ConcernStatus { get; set; }

    public virtual Class? Class { get; set; }

    public virtual User? User { get; set; }
}
