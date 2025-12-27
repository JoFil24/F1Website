import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TracksService, Track } from '../../api';

@Component({
  selector: 'app-tracks-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tracks-form.html',
  styleUrl: './tracks-form.css',
})
export class TracksForm implements OnInit{
  track: Track = {};
  isEdit = false;

  constructor(
    private tracksService: TracksService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.tracksService.apiTracksIdGet(id).subscribe(d => {
        this.track = d;
      });
    }
  }

  save() {
    if (this.isEdit) {
      this.tracksService.apiTracksIdPut(this.track.id!, this.track)
        .subscribe(() => this.router.navigate(['/tracks']));
    } else {
      // Ensure new tracks are visible by default
      if (this.track.isVisible === undefined) {
        this.track.isVisible = true;
      }
      this.tracksService.apiTracksPost(this.track)
        .subscribe(() => this.router.navigate(['/tracks']));
    }
  }
}
