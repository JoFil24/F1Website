import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterLink } from '@angular/router';
import { DriversService, Driver } from '../../api';

@Component({
  selector: 'app-driver-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './driver-list.html',
  styleUrl: './driver-list.css',
})
export class DriverList implements OnInit {
  drivers: Driver[] = [];

  constructor(private driversService: DriversService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(): void {
    this.driversService.apiDriversAllGet().subscribe({
      next: (d) => {
        this.drivers = d ?? [];

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

}
