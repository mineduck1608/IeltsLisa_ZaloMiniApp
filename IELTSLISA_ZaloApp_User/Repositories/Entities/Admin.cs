using System;
using System.Collections.Generic;

namespace Repositories.Entities;

public partial class Admin
{
    public string Id { get; set; } = null!;

    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;
}
