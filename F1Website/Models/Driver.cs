using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text.Json.Serialization;

namespace F1Website.Models;

public partial class Driver
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Country { get; set; } = null!;

    public bool IsVisible { get; set; }

    [JsonIgnore]
    public virtual ICollection<DriverTeam> DriverTeams { get; set; } = new List<DriverTeam>();

    [JsonIgnore]
    public virtual ICollection<Point> Points { get; set; } = new List<Point>();
}
