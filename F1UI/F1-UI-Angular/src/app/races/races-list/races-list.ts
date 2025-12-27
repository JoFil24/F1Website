import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterLink } from '@angular/router';
import { RacesService, RaceDto } from '../../api';

@Component({
  selector: 'app-races-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './races-list.html',
  styleUrl: './races-list.css',
})
export class RacesList implements OnInit {
  races: RaceDto[] = []; 

  constructor(private racesService: RacesService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadRaces();
  }

  loadRaces(): void {
    this.racesService.apiRacesRacesWithTracksGet().subscribe({
      next: (d) => {
        this.races = d ?? [];

        console.log('Loaded races:', this.races);

        // Ensure the UI updates after data load
        //Without this, the data doesn't show up in the table
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load races', err)
    });
  }

  deleteRace(id: number): void {
    if (!id) return;
    this.racesService.apiRacesIdDelete(id).subscribe({
      next: () => this.loadRaces(),
      error: (err) => console.error('Failed to delete race', err)
    });
  }
}
