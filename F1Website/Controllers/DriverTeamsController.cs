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
    [Route("api/[controller]")]
    [ApiController]
    public class DriverTeamsController : ControllerBase
    {
        private readonly F1Context _context;

        public DriverTeamsController(F1Context context)
        {
            _context = context;
        }

        // GET: api/DriverTeams
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DriverTeam>>> GetDriverTeams()
        {
            return await _context.DriverTeams.ToListAsync();
        }

        // GET: api/DriverTeams/5
        [HttpGet("{driverId}/{teamId}")]
        public async Task<ActionResult<DriverTeam>> GetDriverTeam(int driverId, int teamId)
        {
            //var driverTeam = await _context.DriverTeams.FindAsync(id);

            var driverTeam = await _context.DriverTeams.FirstOrDefaultAsync(i => i.DriverId == driverId && i.TeamId == teamId);

            if (driverTeam == null)
            {
                return NotFound();
            }

            return driverTeam;
        }

        [HttpGet("driver/{driverId}")]
        public async Task<ActionResult<DriverTeam>> GetDriverTeamFromDriver(int driverId)
        {
            var driverTeams = await _context.DriverTeams.Where(i => i.DriverId == driverId).ToListAsync();

            if(driverTeams == null)
            {
                return BadRequest();
            }

            return Ok(driverTeams);
        }

        [HttpGet("team/{teamId}")]
        public async Task<ActionResult<DriverTeam>> GetDriverTeamFromTeam(int teamId)
        {
            var driverTeams = await _context.DriverTeams.Where(i => i.TeamId == teamId).ToListAsync();

            if (driverTeams == null)
            {
                return BadRequest();
            }

            return Ok(driverTeams);
        }

        // PUT: api/DriverTeams/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{driverId}/{teamId}")]
        public async Task<IActionResult> PutDriverTeam(int driverId, int teamId, DriverTeam driverTeam)
        {
            if (driverId != driverTeam.DriverId || teamId != driverTeam.TeamId)
            {
                return BadRequest();
            }

            //asdfgdgsds

            _context.Entry(driverTeam).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DriverTeamExists(driverId, teamId))
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

        // POST: api/DriverTeams
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DriverTeam>> PostDriverTeam(DriverTeam driverTeam)
        {
            _context.DriverTeams.Add(driverTeam);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (DriverTeamExists(driverTeam.DriverId, driverTeam.TeamId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetDriverTeam", new { driverId = driverTeam.DriverId, teamId = driverTeam.TeamId }, driverTeam);
        }

        // DELETE: api/DriverTeams/5
        [HttpDelete("{driverId}/{teamId}")]
        public async Task<IActionResult> DeleteDriverTeam(int driverId, int teamId)
        {
            //var driverTeam = await _context.DriverTeams.FindAsync(id);

            var driverTeam = await _context.DriverTeams.FirstOrDefaultAsync(i => i.DriverId == driverId && i.TeamId == teamId);
            if (driverTeam == null)
            {
                return NotFound();
            }

            _context.DriverTeams.Remove(driverTeam);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DriverTeamExists(int driverId, int teamId)
        {
            return _context.DriverTeams.Any(e => e.DriverId == driverId && e.TeamId == teamId);
        }
    }
}
