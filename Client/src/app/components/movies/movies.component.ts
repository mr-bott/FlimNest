import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent implements OnInit {
  hero: any;
  movies_data: any[] = [];
  recommendedMovies: any[] = [];
  watchedMovies: any[] = [];
  watchListMovies: any[] = [];
  likedMovies:any[]=[];

  movieCategories: { [key: string]: any[] } = {
    nowPlayingMovies: [],
    popularMovies: [],
    upcomingMovies: [],
    topRatedMovies: [],
  };

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) {}
  ngOnInit() {
    this.spinner.show();
    this.loadMovies();
    this.getNowPlaying(2);
    this.getRecommendedMovies();
    this.getWatchListMovies();
    this.getWatchedMovies();

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
          liked:item.liked
        }));
        this.likedMovies= res.filter((item: any) => item.liked).map((item: any) => ({
          link: `/movie/${item.tmdbId}`,
          imgSrc: item.posterPath
            ? `https://image.tmdb.org/t/p/w500${item.posterPath}`
            : null,
          title: item.title,
          rating: item.rating ? item.rating * 10 : 0,
          vote: item.rating,
          liked:item.liked
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

  getNowPlaying(page: number) {
    this.apiService
      .getNowPlaying('movie', page)
      .pipe(delay(2000))
      .subscribe(
        (res: any) => {
          this.movies_data = res.results.map((item: any) => ({
            ...item,
            link: `/movie/${item.id}`,
          }));
        },
        (error) => {
          console.error('Error fetching now playing data', error);
        },
      );
  }

  loadMovies(): void {
    this.fetchMovies('now_playing', 'nowPlayingMovies');
    this.fetchMovies('popular', 'popularMovies');
    this.fetchMovies('upcoming', 'upcomingMovies');
    this.fetchMovies('top_rated', 'topRatedMovies');
  }

  fetchMovies(category: string, property: string): void {
    this.apiService.getCategory(category, 1, 'movie').subscribe(
      (response) => {
        this.movieCategories[property] = response.results.map((item: any) => ({
          link: `/movie/${item.id}`,
          linkExplorer: `/movie/category/${category}`,
          imgSrc: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : null,
          title: item.title,
          rating: item.vote_average * 10,
          vote: item.vote_average,
        }));
      },
      (error) => {
        console.error(`Error fetching ${category} movies:`, error);
      },
    );
  }
}
