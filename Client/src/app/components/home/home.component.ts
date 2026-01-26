import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { delay } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  moviesSlider: any[] = [];
  tvSlider: any[] = [];
  movies_data: any[] = [];
  recommendedMovies: any[] = [];
  recentlyViewedMovies: any[] = [];
  watchedMovies: any[] = [];
  watchListMovies: any[] = [];

  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.fetchTrendingContent('movie', 1, 'movies');
    this.fetchTrendingContent('tv', 1, 'tvShows');
    this.getNowPlaying('movie', 1);
    this.getrecentlyViewedMovies();
    this.getRecommendedMovies();
    this.getWatchedMovies();
    this.getWatchListMovies();

    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }

  //watched movies
  getWatchedMovies() {
    this.apiService.getWatchedMovies().subscribe(
      (res: any) => {
        this.watchedMovies = res.map((item: any) => ({
          link: `/movie/${item.tmdbId}`,
          imgSrc: item.posterPath
            ? `https://image.tmdb.org/t/p/w500${item.posterPath}`
            : null,
          title: item.title,
          rating: item.rating ? item.rating * 10 : 0,
          vote: item.rating,
          liked: item.liked,
        }));
      },
      (error) => {
        console.error('Error fetching watched movies', error);
      },
    );
  }
  //watchlist
  getWatchListMovies() {
    this.apiService.getWatchListMovies().subscribe(
      (res: any) => {
        this.watchListMovies = res.map((item: any) => ({
          link: `/movie/${item.tmdbId}`,
          imgSrc: item.posterPath
            ? `https://image.tmdb.org/t/p/w500${item.posterPath}`
            : null,
          title: item.title,
          rating: item.rating ? item.rating * 10 : 0,
          vote: item.rating,
        }));
      },
      (error) => {
        console.error('Error fetching watched movies', error);
      },
    );
  }

  //recomanded movies
  getRecommendedMovies() {
    this.apiService.getRecommendedMovies().subscribe(
      (res: any) => {
        this.recommendedMovies = res.map((item: any) => ({
          link: `/movie/${item.id}`,
          imgSrc: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : null,
          title: item.title,
          rating: item.vote_average * 10,
          vote: item.vote_average,
        }));
      },
      (error) => {
        console.error('Error fetching recommended movies', error);
      },
    );
  }

  // recently viewed movies
  getrecentlyViewedMovies() {
    this.apiService.getRecentlyViewedMovies().subscribe(
      (res: any) => {
        this.recentlyViewedMovies = res.map((item: any) => ({
          link: `/movie/${item.tmdbId}`,
          imgSrc: item.posterPath
            ? `https://image.tmdb.org/t/p/w500${item.posterPath}`
            : null,
          title: item.title,
          rating: item.rating ? item.rating * 10 : 0,
          vote: item.rating,
        }));
      },
      (error) => {
        console.error('Error fetching recently viewed movies', error);
      },
    );
  }

  // Slider Data
  getNowPlaying(mediaType: 'movie', page: number) {
    this.apiService
      .getNowPlaying(mediaType, page)
      .pipe(delay(2000))
      .subscribe(
        (res: any) => {
          this.movies_data = res.results.map((item: any) => {
            const movieItem = {
              ...item,
              link: `/movie/${item.id}`,
              videoId: '', // Initialize with an empty string
            };

            // Fetch the trailer video key for each movie
            this.apiService.getYouTubeVideo(item.id, 'movie').subscribe(
              (videoRes: any) => {
                const video = videoRes.results.find(
                  (vid: any) =>
                    vid.site === 'YouTube' && vid.type === 'Trailer',
                );
                if (video) {
                  movieItem.videoId = video.key; // Set the video key if available
                }
              },
              (videoError) => {
                console.error(
                  'Error fetching YouTube video for Movie:',
                  videoError,
                );
              },
            );

            return movieItem;
          });
        },
        (error) => {
          console.error('Error fetching now playing data', error);
        },
      );
  }

  fetchTrendingContent(media: string, page: number, type: string): void {
    this.apiService.getTrending(media, page).subscribe(
      (response) => {
        if (type === 'movies') {
          this.moviesSlider = response.results.map((item: any) => ({
            link: `/movie/${item.id}`,
            imgSrc: item.poster_path
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : null,
            title: item.title,
            rating: item.vote_average * 10,
            vote: item.vote_average,
          }));
        } else if (type === 'tvShows') {
          this.tvSlider = response.results.map((item: any) => ({
            link: `/tv/${item.id}`,
            imgSrc: item.poster_path
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : null,
            title: item.name,
            rating: item.vote_average * 10,
            vote: item.vote_average,
          }));
        }
      },
      (error) => {
        console.error(`Error fetching trending ${type}:`, error);
      },
    );
  }
}
