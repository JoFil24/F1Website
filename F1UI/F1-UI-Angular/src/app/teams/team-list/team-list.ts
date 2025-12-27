import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterLink } from '@angular/router';
import { TeamsService, Team} from '../../api';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './team-list.html',
  styleUrl: './team-list.css',
})
export class TeamList implements OnInit {
  teams: Team[] = [];

  constructor(private teamsService: TeamsService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.teamsService.apiTeamsGet().subscribe({
      next: (d) => {
        this.teams = d ?? [];

        console.log('Loaded teams:', this.teams);

        // Ensure the UI updates after data load
        //Without this, the data doesn't show up in the table
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load teams', err)
    });
  }

  deleteTeam(id: number): void {
    if (!id) return;
    this.teamsService.apiTeamsIdDelete(id).subscribe({
      next: () => this.loadTeams(),
      error: (err) => console.error('Failed to delete team', err)
    });
  }

}
