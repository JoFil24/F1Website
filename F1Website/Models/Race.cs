using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace F1Website.Models;

public partial class Race
{ 
    public int Id { get; set; }

    public DateTime RaceDate { get; set; }

    public int? Laps { get; set; }

    public int TrackId { get; set; }

    [JsonIgnore]
    public virtual ICollection<Point> Points { get; set; } = new List<Point>();

    [JsonIgnore]
    public virtual Track Track { get; set; } = null!;
}
