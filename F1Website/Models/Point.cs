using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace F1Website.Models;

public partial class Point
{
    public int DriverId { get; set; }

    public int RaceId { get; set; }

    public double? Points { get; set; }

    public int? Position { get; set; }

    [JsonIgnore]
    public virtual Driver Driver { get; set; } = null!;

    [JsonIgnore]
    public virtual Race Race { get; set; } = null!;
}
