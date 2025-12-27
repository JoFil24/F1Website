import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterLink } from '@angular/router';
import { PointsService, PointsDto } from '../../api';

@Component({
  selector: 'app-points-list',
  // standalone: true,
  // imports: [CommonModule, RouterLink],
  imports: [CommonModule],
  templateUrl: './points-list.html',
  styleUrl: './points-list.css',
})
export class PointsList implements OnInit {
  points: PointsDto[] = []; 

  constructor(private pointsService: PointsService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadPoints();
  }

  loadPoints(): void {
    this.pointsService.apiPointsGet().subscribe({
      next: (d) => {
        this.points = d ?? [];

        console.log('Loaded points:', this.points);

        // Ensure the UI updates after data load
        //Without this, the data doesn't show up in the table
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load points', err)
    });
  }

  deletePointsEntry(driverId?: number, raceId?: number): void {
    if (driverId == null || raceId == null) return;
    this.pointsService.apiPointsDriverIdRaceIdDelete(driverId, raceId).subscribe({
      next: () => this.loadPoints(),
      error: (err) => console.error('Failed to delete points entry', err)
    });
  }
}
