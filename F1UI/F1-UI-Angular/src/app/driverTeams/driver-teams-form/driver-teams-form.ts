import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DriverTeamsService, DriverTeam } from '../../api';

@Component({
  selector: 'app-driver-teams-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './driver-teams-form.html',
  styleUrl: './driver-teams-form.css',
})
export class DriverTeamsForm implements OnInit{
  driverTeam: DriverTeam = {};
  isEdit = false;
  driverId?: number;
  teamId?: number;

  constructor(
    private driverTeamsService: DriverTeamsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.driverId = this.route.snapshot.params['driverId'];
    this.teamId = this.route.snapshot.params['teamId'];

    if (this.driverId != null && this.teamId != null) {
      this.isEdit = true;
      this.driverTeamsService.apiDriverTeamsDriverIdTeamIdGet(this.driverId, this.teamId).subscribe(d => {
        this.driverTeam = d ?? {};
      });
    }
  }

  save() {
    if (this.isEdit) {
      if (this.driverId == null || this.teamId == null) {
        console.error('Missing composite keys for update');
        return;
      }
      this.driverTeamsService.apiDriverTeamsDriverIdTeamIdPut(this.driverId, this.teamId, this.driverTeam)
        .subscribe(() => this.router.navigate(['/driverTeams']));
    } else {
      this.driverTeamsService.apiDriverTeamsPost(this.driverTeam)
        .subscribe(() => this.router.navigate(['/driverTeams']));
    }
  }
}
