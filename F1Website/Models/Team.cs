using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace F1Website.Models;

public partial class Team
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Engine { get; set; } = null!;

    public bool IsVisible { get; set; }

    [JsonIgnore]
    public virtual ICollection<DriverTeam> DriverTeams { get; set; } = new List<DriverTeam>();
}
