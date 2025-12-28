import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { PointsService, Point, DriversService, Driver, DriverTeamDto, TracksService, RacesService, Race } from '../../api';

@Component({
  selector: 'app-points-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './points-form.html',
  styleUrl: './points-form.css',
})
export class PointsForm implements OnInit{
  pointsEntry: Point = {};
  isEdit = false;

  drivers: DriverTeamDto[] = [];
  selectedDriverId?: number;
  trackName?: string | null;
  driverName?: string | null;
  raceId?: number;

  constructor(
    private pointsService: PointsService,
    private driversService: DriversService,
    private tracksService: TracksService,
    private racesService: RacesService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const driverId = this.route.snapshot.params['driverId'];
    const raceIdParam = this.route.snapshot.params['raceId'];

    // load only drivers that have teams (driver-team pairs) for dropdown
    this.driversService.apiDriversDriverTeamPairsGet().subscribe(d => { this.drivers = d ?? []; this.cdr.detectChanges(); });

    if (driverId != null && raceIdParam != null) {
      this.isEdit = true;
      this.raceId = Number(raceIdParam);
      const rId = Number(raceIdParam);
      const dId = Number(driverId);
      this.pointsService.apiPointsDriverIdRaceIdGet(dId, rId).subscribe(d => {
        this.pointsEntry = d ?? {};
        this.selectedDriverId = this.pointsEntry.driverId;
        // load driver and track names for readonly display
        this.driversService.apiDriversIdGet(dId).subscribe(dd => { this.driverName = dd.name ?? null; this.cdr.detectChanges(); });
        this.racesService.apiRacesIdGet(rId).subscribe(rr => {
          if (rr.trackId) this.tracksService.apiTracksIdGet(rr.trackId).subscribe(t => { this.trackName = t.name ?? null; this.cdr.detectChanges(); });
        });
        this.cdr.detectChanges();
      });
    } else {
      // create mode: raceId provided in route
      const rId = this.route.snapshot.params['raceId'];
      if (rId) {
        this.raceId = Number(rId);
        this.racesService.apiRacesIdGet(this.raceId!).subscribe(rr => {
          if (rr.trackId) this.tracksService.apiTracksIdGet(rr.trackId).subscribe(t => { this.trackName = t.name ?? null; this.cdr.detectChanges(); });
          this.cdr.detectChanges();
        });
      }
    }
  }

  save() {
    if (this.isEdit) {
      const dId = this.pointsEntry.driverId!;
      const rId = this.pointsEntry.raceId!;
      if (dId == null || rId == null) {
        console.error('Missing composite keys for update');
        return;
      }
      this.pointsService.apiPointsDriverIdRaceIdPut(dId, rId, this.pointsEntry as Point)
        .subscribe(() => this.router.navigate(['/races', rId, 'points']));
    } else {
      // create new point entry
      if (!this.selectedDriverId || !this.raceId) {
        console.error('Missing driver or race for new points entry');
        return;
      }
      const payload: Point = { driverId: this.selectedDriverId, raceId: this.raceId, position: this.pointsEntry.position, points: this.pointsEntry.points };
      this.pointsService.apiPointsPost(payload)
        .subscribe(() => this.router.navigate(['/races', this.raceId, 'points']));
    }
  }
}

