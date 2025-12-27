import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TeamsService, Team } from '../../api';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './team-form.html',
  styleUrl: './team-form.css',
})
export class TeamForm implements OnInit{
  team: Team = {};
  isEdit = false;

  constructor(
    private teamService: TeamsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.teamService.apiTeamsIdGet(id).subscribe(d => {
        this.team = d;
      });
    }
  }

  save() {
    if (this.isEdit) {
      this.teamService.apiTeamsIdPut(this.team.id!, this.team)
        .subscribe(() => this.router.navigate(['/teams']));
    } else {
      // Ensure new teams are visible by default
      if (this.team.isVisible === undefined) {
        this.team.isVisible = true;
      }
      this.teamService.apiTeamsPost(this.team)
        .subscribe(() => this.router.navigate(['/teams']));
    }
  }
}
