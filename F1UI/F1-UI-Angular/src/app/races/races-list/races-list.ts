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

  //format the dates in a more readable way
  formatDate(dateStr?: string | null): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const year = d.getFullYear();
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const month = monthNames[d.getMonth()];
    const ordinal = (n: number) => {
      const s = ["th","st","nd","rd"], v = n % 100;
      return (s[(v-20)%10] || s[v] || s[0]);
    };
    return `${day}${ordinal(day)} ${month} ${year}`;
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
