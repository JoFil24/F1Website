import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

import { PointsService, PointsDto } from '../../api';

@Component({
  selector: 'app-race-points',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './race-points.html',
})
export class RacePoints implements OnInit {
  raceId?: number;
  points: PointsDto[] = [];

  constructor(private pointsService: PointsService, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    if (!isNaN(id) && id > 0) {
      this.raceId = id;
      this.pointsService.apiPointsRaceDriverNamesRaceIdGet(id).subscribe({
        next: (d) => {
          console.log('Loaded race points for', id, d);
          this.points = d ?? [];
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load race points', err);
        }
      });
    }
  }

  deletePointsEntry(driverId?: number): void {
    if (driverId == null || this.raceId == null) return;
    if (!confirm('Delete points entry for this driver?')) return;
    this.pointsService.apiPointsDriverIdRaceIdDelete(driverId, this.raceId).subscribe({
      next: () => {
        // reload list
        this.pointsService.apiPointsRaceDriverNamesRaceIdGet(this.raceId!).subscribe(d => {
          this.points = d ?? [];
          this.cdr.detectChanges();
        });
      },
      error: (err) => console.error('Failed to delete points entry', err)
    });
  }
}
