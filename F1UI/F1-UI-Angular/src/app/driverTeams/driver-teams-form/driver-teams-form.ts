import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DriverTeamsService, DriverTeam, DriversService, TeamsService, DriverDto, TeamDto } from '../../api';

@Component({
  selector: 'app-driver-teams-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './driver-teams-form.html',
  styleUrl: './driver-teams-form.css',
})
export class DriverTeamsForm implements OnInit{
  driverTeam: DriverTeam = {};
  isEdit = false;
  driverId?: number;
  teamId?: number;
  drivers: DriverDto[] = [];
  availableDrivers: DriverDto[] = [];
  teams: TeamDto[] = [];

  constructor(
    private driverTeamsService: DriverTeamsService,
    private driversService: DriversService,
    private teamsService: TeamsService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // load drivers, driver-team pairs and teams for dropdowns
    this.driversService.apiDriversGet().subscribe(d => {
      this.drivers = d ?? [];
      // after loading drivers, load driver-team pairs to compute available drivers
      this.driversService.apiDriversDriverTeamPairsGet().subscribe(pairs => {
        const pairedIds = new Set((pairs ?? []).map(p => p.id));
        this.availableDrivers = (this.drivers ?? []).filter(dr => !pairedIds.has(dr.id as number));
        this.cdr.detectChanges();
      });
      this.cdr.detectChanges();
    });
    this.teamsService.apiTeamsGet().subscribe(t => {
      this.teams = t ?? [];
      this.cdr.detectChanges();
    });
    this.driverId = this.route.snapshot.params['driverId'];
    this.teamId = this.route.snapshot.params['teamId'];

    if (this.driverId != null && this.teamId != null) {
      this.isEdit = true;
      this.driverTeamsService.apiDriverTeamsDriverIdTeamIdGet(this.driverId, this.teamId).subscribe(d => {
        this.driverTeam = d ?? {};
        // coerce IDs to numbers to match option ngValue types
        if (this.driverTeam.driverId != null) this.driverTeam.driverId = Number(this.driverTeam.driverId);
        if (this.driverTeam.teamId != null) this.driverTeam.teamId = Number(this.driverTeam.teamId);
        if (this.driverTeam.raceNumber != null) this.driverTeam.raceNumber = Number(this.driverTeam.raceNumber);
        this.cdr.detectChanges();
      });
    }
    else {
      // create mode: default dateFrom to today at midnight UTC with trailing Z
      const today = new Date();
      const isoMidnightZ = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())).toISOString().replace('.000Z', 'Z');
      this.driverTeam.dateFrom = isoMidnightZ;
      // default dateTo to 2026-12-31 at midnight UTC with trailing Z
      const isoEnd2026Z = new Date(Date.UTC(2026, 11, 31)).toISOString().replace('.000Z', 'Z');
      this.driverTeam.dateTo = isoEnd2026Z;
    }
  }

  private normalizeDateToMidnightZ(value?: string): string {
    if (!value) {
      const now = new Date();
      return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().replace('.000Z', 'Z');
    }
    // already has trailing Z and includes time -> assume valid
    if (value.endsWith('Z')) return value;
    // plain date like YYYY-MM-DD -> convert to midnight UTC
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split('-').map(n => Number(n));
      return new Date(Date.UTC(y, m - 1, d)).toISOString().replace('.000Z', 'Z');
    }
    // has time but no Z or has milliseconds - strip milliseconds and append Z
    const stripped = value.replace(/\.\d+Z?$/, '');
    return stripped.endsWith('Z') ? stripped : `${stripped}Z`;
  }

  save() {
    if (this.isEdit) {
      if (this.driverId == null || this.teamId == null) {
        console.error('Missing composite keys for update');
        return;
      }
      // ensure dateFrom set when updating and normalize to midnight Z
      this.driverTeam.dateFrom = this.normalizeDateToMidnightZ(this.driverTeam.dateFrom);

      // ensure dateTo set when updating and normalize to midnight Z
      if (this.driverTeam.dateTo != null) {
        this.driverTeam.dateTo = this.normalizeDateToMidnightZ(this.driverTeam.dateTo);
      }

      // build array payload for logging
      const payloadArray = [
        this.driverTeam.driverId ?? this.driverId,
        this.driverTeam.teamId ?? this.teamId,
        this.driverTeam.dateFrom ?? null,
        this.driverTeam.dateTo ?? null,
        this.driverTeam.raceNumber ?? null
      ];
      console.log('DriverTeam payload array (update):', payloadArray);
      this.driverTeamsService.apiDriverTeamsDriverIdTeamIdPut(this.driverId, this.teamId, this.driverTeam)
        .subscribe(() => this.router.navigate(['/drivers']));
    } else {
      // ensure dateFrom set when creating and normalize to midnight Z
      this.driverTeam.dateFrom = this.normalizeDateToMidnightZ(this.driverTeam.dateFrom);
      
      // ensure dateFrom set when creating and normalize to midnight Z
      if (this.driverTeam.dateTo != null) {
        this.driverTeam.dateTo = this.normalizeDateToMidnightZ(this.driverTeam.dateTo);
      }
      // build array payload for logging
      const payloadArray = [
        this.driverTeam.driverId ?? null,
        this.driverTeam.teamId ?? null,
        this.driverTeam.dateFrom ?? null,
        this.driverTeam.dateTo ?? null,
        this.driverTeam.raceNumber ?? null
      ];
      console.log('DriverTeam payload array (create):', payloadArray);
      this.driverTeamsService.apiDriverTeamsPost(this.driverTeam)
        .subscribe(() => this.router.navigate(['/drivers']));
    }
  }
}
