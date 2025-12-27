import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PointsService, PointsDto, Point } from '../../api';

@Component({
  selector: 'app-points-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './points-form.html',
  styleUrl: './points-form.css',
})
export class PointsForm implements OnInit{
  pointsEntry: PointsDto = {};
  isEdit = false;

  constructor(
    private pointsService: PointsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const driverId = this.route.snapshot.params['driverId'];
    const raceId = this.route.snapshot.params['raceId'];

    if (driverId != null && raceId != null) {
      this.isEdit = true;
      this.pointsService.apiPointsDriverIdRaceIdGet(driverId, raceId).subscribe(d => {
        this.pointsEntry = d ?? {};
      });
    } else {
      // fallback: support older route using single id param if present
      const id = this.route.snapshot.params['id'];
      if (id) {
        this.isEdit = true;
        // try to fetch by driver id (existing generator may have other endpoints)
        // using apiPointsDriverDriverIdGet if appropriate
        try {
          // @ts-ignore
          this.pointsService.apiPointsDriverDriverIdGet(id).subscribe(d => this.pointsEntry = d ?? {});
        } catch {
          // ignore
        }
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
        .subscribe(() => this.router.navigate(['/points']));
    } else {
      // create new point entry
      this.pointsService.apiPointsPost(this.pointsEntry as Point)
        .subscribe(() => this.router.navigate(['/points']));
    }
  }
}
