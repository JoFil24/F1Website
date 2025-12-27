import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterLink } from '@angular/router';
import { TracksService, Track } from '../../api';

@Component({
  selector: 'app-tracks-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tracks-list.html',
  styleUrl: './tracks-list.css',
})
export class TracksList implements OnInit {
  tracks: Track[] = [];

  constructor(private tracksService: TracksService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadTracks();
  }

  loadTracks(): void {
    this.tracksService.apiTracksGet().subscribe({
      next: (d) => {
        this.tracks = d ?? [];

        console.log('Loaded tracks:', this.tracks);

        // Ensure the UI updates after data load
        //Without this, the data doesn't show up in the table
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load tracks', err)
    });
  }

  deleteTrack(id: number): void {
    if (!id) return;
    this.tracksService.apiTracksIdDelete(id).subscribe({
      next: () => this.loadTracks(),
      error: (err) => console.error('Failed to delete track', err)
    });
  }

}
