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
    public class PointsDto
    {
        public int DriverId { get; set; }
        public double? Points { get; set; }
        public int? Position { get; set; }
        public string? DriverName { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class PointsController : ControllerBase
    {
        private readonly F1Context _context;

        public PointsController(F1Context context)
        {
            _context = context;
        }

        // GET: api/Points
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Point>>> GetPoints()
        {
            return await _context.Points.ToListAsync();
        }

        // GET: api/Points/5
        [HttpGet("{driverId}/{raceId}")]
        public async Task<ActionResult<Point>> GetPoint(int driverId, int raceId)
        {
            //var points = await _context.Points.ToListAsync();

            var point = await _context.Points.FirstOrDefaultAsync(i => i.RaceId == raceId && i.DriverId == driverId);
                        
            if (point == null)
            {
                return NotFound();
            }

            return point;
        }

        [HttpGet("driver/{driverId}")]
        public async Task<ActionResult<Point>> GetPointFromDriver(int driverId)
        {
            //var points = await _context.Points.ToListAsync();

            var point = await _context.Points.Where(i => i.DriverId == driverId).ToListAsync();

            if (point == null)
            {
                return NotFound();
            }

            return Ok(point);
        }

        [HttpGet("race/{raceId}")]
        public async Task<ActionResult<Point>> GetPointFromRace(int raceId)
        {
            //var points = await _context.Points.ToListAsync();

            var point = await _context.Points.Where(i => i.RaceId == raceId).ToListAsync();

            if (point == null)
            {
                return NotFound();
            }

            return Ok(point);
        }

        [HttpGet("raceDriverNames/{raceId}")]
        public async Task<ActionResult<IEnumerable<PointsDto>>> GetPointsFromRaceDriverNames(int raceId)
        {
            return await (from p in _context.Points
                          join r in _context.Races
                          on p.RaceId equals r.Id
                          join d in _context.Drivers
                          on p.DriverId equals d.Id
                          where p.RaceId == raceId
                          orderby p.Position ascending
                          select new PointsDto { DriverId = p.DriverId, DriverName = d.Name, Points = p.Points, Position = p.Position }).ToListAsync();
        }

        // PUT: api/Points/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{driverId}/{raceId}")]
        public async Task<IActionResult> PutPoint(int driverId, int raceId, Point point)
        {
            if (driverId != point.DriverId || raceId != point.RaceId)
            {
                return BadRequest();
            }

            if(PositionOccupied(point.RaceId, point.Position))
            {
                return Conflict("There is already an entry in this position in this race");
            }

            _context.Entry(point).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PointExists(driverId, raceId))
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

        // POST: api/Points
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Point>> PostPoint(Point point)
        {
            if (PositionOccupied(point.RaceId, point.Position))
            {
                return Conflict("There is already a racer in that position");
            }

            _context.Points.Add(point);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PointExists(point.DriverId, point.RaceId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPoint", new { driverId = point.DriverId, raceId = point.RaceId }, point);
        }

        // DELETE: api/Points/5
        [HttpDelete("{driverId}/{raceId}")]
        public async Task<IActionResult> DeletePoint(int driverId, int raceId)
        {
            //var point = await _context.Points.FindAsync(id);
            var point = await _context.Points.FirstOrDefaultAsync(i => i.DriverId == driverId && i.RaceId == raceId);
            if (point == null)
            {
                return NotFound();
            }

            _context.Points.Remove(point);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PointExists(int driverId, int raceId)
        {
            return _context.Points.Any(e => e.DriverId == driverId && e.RaceId == raceId);
        }

        private bool PositionOccupied(int raceId, int? position)
        {
            return _context.Points.Any(e => e.RaceId == raceId && e.Position == position);
        }
    }
}
