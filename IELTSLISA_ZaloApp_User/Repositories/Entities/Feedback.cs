using System;
using System.Collections.Generic;

namespace Repositories.Entities;

public partial class Feedback
{
    public string FbId { get; set; } = null!;

    public string? FbTitle { get; set; }

    public string? FbContent { get; set; }

    public string? FbName { get; set; }

    public string? FbClass { get; set; }

    public string? FbPic { get; set; }
}
