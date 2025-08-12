using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace F1Website.Models;

public partial class DriverTeam
{
    public int DriverId { get; set; }

    public int TeamId { get; set; }

    public DateTime DateFrom { get; set; }

    public DateTime? DateTo { get; set; }

    public int? RaceNumber { get; set; }

    [JsonIgnore]
    public virtual Driver Driver { get; set; } = null!;

    [JsonIgnore]
    public virtual Team Team { get; set; } = null!;
}
