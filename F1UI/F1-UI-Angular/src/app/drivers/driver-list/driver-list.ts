import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterLink } from '@angular/router';
import { DriversService, DriverTeamDto, DriverTeamsService } from '../../api';

@Component({
  selector: 'app-driver-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './driver-list.html',
  styleUrl: './driver-list.css',
})
export class DriverList implements OnInit {
  drivers: DriverTeamDto[] = [];

  constructor(private driversService: DriversService, private driverTeamsService: DriverTeamsService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(): void {
    this.driversService.apiDriversDriverTeamPairsGet().subscribe({
      next: (d) => {
        this.drivers = d ?? [];

        console.log('Loaded drivers:', this.drivers);

        // Ensure the UI updates after data load
        //Without this, the data doesn't show up in the table
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load drivers', err)
    });
  }

  deleteDriver(id: number): void {
    if (!id) return;
    this.driversService.apiDriversIdDelete(id).subscribe({
      next: () => this.loadDrivers(),
      error: (err) => console.error('Failed to delete driver', err)
    });
  }

  removeDriverFromTeam(driverId?: number, teamId?: number): void {
    if (!driverId || !teamId) return;
    this.driverTeamsService.apiDriverTeamsDriverIdTeamIdDelete(driverId, teamId).subscribe({
      next: () => this.loadDrivers(),
      error: (err) => console.error('Failed to remove driver from team', err)
    });
  }

}
