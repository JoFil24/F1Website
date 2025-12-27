import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RacesService, Race } from '../../api';

@Component({
  selector: 'app-races-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './races-form.html',
  styleUrl: './races-form.css',
})
export class RacesForm implements OnInit{
  race: Race = {};
  isEdit = false;

  constructor(
    private racesService: RacesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.racesService.apiRacesIdGet(id).subscribe(d => {
        this.race = d;
      });
    }
  }

  save() {
    if (this.isEdit) {
      this.racesService.apiRacesIdPut(this.race.id!, this.race)
        .subscribe(() => this.router.navigate(['/races']));
    } else {
      // Ensure new races are visible by default
      if (this.race.isVisible === undefined) {
        this.race.isVisible = true;
      }
      this.racesService.apiRacesPost(this.race)
        .subscribe(() => this.router.navigate(['/races']));
    }
  }
}
