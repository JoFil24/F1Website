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
    public class DriverDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Country { get; set; }
    }

    public class DriverTeamDto
    {
        public int Id { get; set; }
        public int TeamId { get; set; }
        public string? Name { get; set; }
        public string? Country { get; set; }
        public int? RaceNumber { get; set; }
        public string? Team { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class DriversController : ControllerBase
    {
        private readonly F1Context _context;

        public DriversController(F1Context context)
        {
            _context = context;
        }

        // GET: api/Drivers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DriverDto>>> GetDrivers()
        {
            //return await _context.Drivers.Where(i => i.IsVisible).ToListAsync();
            return await _context.Drivers.Where(i => i.IsVisible).Select(d => new DriverDto { Id = d.Id, Name = d.Name, Country = d.Country }).ToListAsync();
        }

        [HttpGet("DriverTeamPairs")]
        public async Task<ActionResult<IEnumerable<DriverTeamDto>>> GetDriverTeamPairs()
        {
            var today = DateTime.Now;

            return await (from D in _context.Drivers
                          join DT in _context.DriverTeams
                          on D.Id equals DT.DriverId
                          join T in _context.Teams
                          on DT.TeamId equals T.Id
                          where (DT.DateTo == null ||
                          DT.DateTo > today) &&
                          D.IsVisible == true &&
                          T.IsVisible == true
                          select new DriverTeamDto { Id = D.Id, TeamId = T.Id, Name = D.Name, Country = D.Country, RaceNumber = DT.RaceNumber, Team = T.Name}).ToListAsync();
        }

        [HttpGet("DriverTeamPairs/{id}")]
        public async Task<ActionResult<IEnumerable<DriverTeamDto>>> GetDriverTeamPair(int id)
        {
            return await (from D in _context.Drivers
                          join DT in _context.DriverTeams
                          on D.Id equals DT.DriverId
                          join T in _context.Teams
                          on DT.TeamId equals T.Id
                          where D.IsVisible == true &&
                          T.IsVisible == true &&
                          D.Id == id
                          select new DriverTeamDto { Id = D.Id, TeamId = T.Id, Name = D.Name, Country = D.Country, RaceNumber = DT.RaceNumber, Team = T.Name }).ToListAsync();
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Driver>>> GetAllDrivers()
        {
            return await _context.Drivers.ToListAsync();
        }

        // GET: api/Drivers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Driver>> GetDriver(int id)
        {
            var driver = await _context.Drivers.FindAsync(id);

            if (driver == null || !driver.IsVisible)
            {
                return NotFound();
            }

            return driver;
        }

        // PUT: api/Drivers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDriver(int id, Driver driver)
        {
            if (id != driver.Id || !driver.IsVisible)
            {
                return BadRequest();
            }

            _context.Entry(driver).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DriverExists(id))
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

        // POST: api/Drivers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Driver>> PostDriver(Driver driver)
        {
            _context.Drivers.Add(driver);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDriver", new { id = driver.Id }, driver);
        }

        // DELETE: api/Drivers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDriver(int id)
        {
            //var driver = await _context.Drivers.FindAsync(id);
            var driver = await _context.Drivers
                .Include(d => d.DriverTeams)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (driver == null)
            {
                return NotFound();
            }

            driver.IsVisible = false;

            foreach(var driverTeam in driver.DriverTeams.Where(dt => dt.DateTo == null))
            {
                driverTeam.DateTo = DateTime.UtcNow;
            }

            //_context.Drivers.Update(driver);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DriverExists(int id)
        {
            return _context.Drivers.Any(e => e.Id == id);
        }
    }
}
