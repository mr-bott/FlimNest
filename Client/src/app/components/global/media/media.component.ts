import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UserActionsService } from '../../../api/userAction.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrl: './media.component.scss'
})
export class MediaComponent implements OnChanges {

  @Input() data: any;
  @Input() externalData: any;
  @Input() availability: any;
  @Input() type: 'movie' | 'tv' | 'person' = 'movie';

  isStatus: any = null;

  constructor(private actionsService: UserActionsService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data?.id) {
      console.log('Media data received:', this.data);
      this.getStatus(this.data.id, this.type);
    }
  }

  getStatus(tmdbId: number, mediaType: string) {
    this.actionsService.getStatus(tmdbId, mediaType).subscribe({
      next: (status) => {
        this.isStatus = status;
      },
      error: (err) => {
        console.error('Error fetching status:', err);
      }
    });
  }

  // ✔ MARK AS WATCHED
  markAsWatched(item: any, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const payload = {
      tmdbId: item.id,
      mediaType: item.media_type || this.type,
      title: item.title || item.name,
      posterPath: item.poster_path,
      rating: item.vote_average || null,
      status: 'watched',
      liked: false,
      genres: item.genres?.map((g: any) => g.id) || []
    };

    this.actionsService.addMedia(payload).subscribe({
      next: () => {
        console.log('Marked as watched');
        this.getStatus(item.id, this.type); // 🔁 refresh status
      },
      error: err => console.error(err)
    });
  }

  // ⏰ ADD TO WATCH LATER
  addToWatchLater(item: any, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const payload = {
      tmdbId: item.id,
      mediaType: item.media_type || this.type,
      title: item.title || item.name,
      posterPath: item.poster_path,
      genres: item.genre_ids || [],
      rating: null,
      status: 'watchlist',
      liked: false
    };

    this.actionsService.addMedia(payload).subscribe({
      next: () => {
        console.log('Added to watchlist');
        this.getStatus(item.id, this.type); // 🔁 refresh status
      },
      error: err => console.error(err)
    });
  }
}
