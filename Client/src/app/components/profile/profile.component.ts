
import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../api/profile.service';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ApiService } from '../../api/api.service';

Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  user: any = null;
  stats: any = null;
  topGenres: any[] = [];
  watchedMovies: any[] = [];
  watchListMovies: any[] = [];
  chart!: Chart;

  genreMap: any = {
    12: 'Adventure',
    14: 'Fantasy',
    878: 'Sci-Fi',
    18: 'Drama',
    53: 'Thriller',
  };

  constructor(private profileService: ProfileService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProfile();
    this.getWatchedMovies();
    this.getWatchListMovies();
  }

  loadProfile() {
    this.profileService.getProfile().subscribe({
      next: (res: any) => {
        this.user = res.user;
        this.stats = res.stats;
        this.topGenres = res.topGenres;
        this.createRadarChart();
        // this.createPieChart();
      },
      error: (err) => console.error(err),
    });
  }

  createRadarChart() {
    if (!this.topGenres.length) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.topGenres.map(
      (g) => this.genreMap[g.genreId] || `Genre ${g.genreId}`
    );

    const dataValues = this.topGenres.map((g) => g.count);

    this.chart = new Chart('piechart', {
      type: 'radar',
      data: {
        labels,
        datasets: [
          {
            label: 'Watched Genres',
            data: dataValues,
            fill: true,
            backgroundColor: 'rgba(56, 189, 248, 0.25)',
            borderColor: 'rgb(56, 189, 248)',
            pointBackgroundColor: 'rgb(56, 189, 248)',
            pointBorderColor: '#020617',
            pointHoverBackgroundColor: '#020617',
            pointHoverBorderColor: 'rgb(56, 189, 248)',
            borderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          r: {
            angleLines: { color: '#dae1ebff' },
            grid: { color: '#eff1f4ff' },
            pointLabels: {
              color: '#e5e7eb',
              font: { size: 13 },
            },
            ticks: {
              color: '#94a3b8',
              backdropColor: 'transparent',
            },
          },
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#e5e7eb',
            },
          },
        },
      },
    });
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
        vote: item.rating
      }));
    },
    (error) => {
      console.error('Error fetching watched movies', error);
    }
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
        vote: item.rating
      }));
    },
    (error) => {
      console.error('Error fetching watched movies', error);
    }
  );
}


}
