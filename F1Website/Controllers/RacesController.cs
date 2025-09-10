using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using F1Website.Models;

namespace F1Website.Controllers
{
    public class RaceDto
    {
        public int Id { get; set; }
        public DateTime RaceDate { get; set; }
        public int? Laps { get; set; }
        public int TrackId { get; set; }
        public string? TrackName { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class RacesController : ControllerBase
    {
        private readonly F1Context _context;

        public RacesController(F1Context context)
        {
            _context = context;
        }

        // GET: api/Races
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Race>>> GetRaces()
        {
            return await _context.Races.Where(i => i.IsVisible).ToListAsync();
        }

        // GET: api/Races
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Race>>> GetAllRaces()
        {
            return await _context.Races.ToListAsync();
        }

        [HttpGet("RacesWithTracks")]
        public async Task<ActionResult<IEnumerable<RaceDto>>> GetRacesTracks()
        {
            //return _context.Races.Where(r => r.IsVisible).Select(r => new RaceDto

            return await (from race in _context.Races
                          join track in _context.Tracks
                          on race.TrackId equals track.Id
                          where race.IsVisible == true
                          select new RaceDto { Id = race.Id, Laps = race.Laps, RaceDate = race.RaceDate, TrackId = race.TrackId, TrackName = track.Name }).ToListAsync();
            
        }

        // GET: api/Races/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Race>> GetRace(int id)
        {
            var race = await _context.Races.FindAsync(id);

            if (race == null || !race.IsVisible)
            {
                return NotFound();
            }

            return race;
        }

        // PUT: api/Races/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRace(int id, Race race)
        {
            if (id != race.Id || !race.IsVisible)
            {
                return BadRequest();
            }

            _context.Entry(race).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RaceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Races
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Race>> PostRace(Race race)
        {
            race.IsVisible = true;
            _context.Races.Add(race);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRace", new { id = race.Id }, race);
        }

        // DELETE: api/Races/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRace(int id)
        {
            var race = await _context.Races.FindAsync(id);
            if (race == null)
            {
                return NotFound();
            }

            race.IsVisible = false;

            //_context.Races.Remove(race);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RaceExists(int id)
        {
            return _context.Races.Any(e => e.Id == id);
        }
    }
}
