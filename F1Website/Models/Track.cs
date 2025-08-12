using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace F1Website.Models;

public partial class Track
{
    [JsonIgnore]
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Country { get; set; } = null!;

    public double Length { get; set; }

    [JsonIgnore]
    public virtual ICollection<Race> Races { get; set; } = new List<Race>();
}
