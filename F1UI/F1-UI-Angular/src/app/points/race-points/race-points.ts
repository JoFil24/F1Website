import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';


import { PointsService, PointsDto } from '../../api';

@Component({
  selector: 'app-race-points',
  standalone: true,
  imports: [CommonModule, RouterLink, NgChartsModule],
  templateUrl: './race-points.html',
})
export class RacePoints implements OnInit {
  raceId?: number;
  points: PointsDto[] = [];

  chartType: ChartType = 'bar';

  chartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Points',
        data: [],
        backgroundColor: '#e10600'
      }
    ]
  };

  constructor(private pointsService: PointsService, private route: ActivatedRoute, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    if (!isNaN(id) && id > 0) {
      this.raceId = id;
      this.pointsService.apiPointsRaceDriverNamesRaceIdGet(id).subscribe({
        next: (d) => {
          console.log('Loaded race points for', id, d);
          this.points = d ?? [];
          this.updateChart();
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
          this.updateChart();
          this.cdr.detectChanges();
        });
      },
      error: (err) => console.error('Failed to delete points entry', err)
    });
  }

  private updateChart(): void {
    this.chartData.labels = this.points.map(p => p.driverName ?? 'Unknown');
    this.chartData.datasets[0].data = this.points.map(p => p.points ?? 0);
  }
}
