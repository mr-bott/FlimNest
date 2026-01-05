// import { Component, OnInit } from '@angular/core';
// import { ProfileService } from '../../api/profile.service';
// import { Chart, ChartConfiguration } from 'chart.js/auto';

// @Component({
//   selector: 'app-profile',
//   templateUrl: './profile.component.html',
//   styleUrl: './profile.component.scss'
// })
// export class ProfileComponent implements OnInit {

//   user: any = null;
//   stats: any = null;
//   topGenres: any[] = [];
//   chart: any;

//   // TMDB Genre Map
//   genreMap: any = {
//     12: 'Adventure',
//     14: 'Fantasy',
//     878: 'Sci-Fi',
//     18: 'Drama',
//     53: 'Thriller'
//   };

//   constructor(private profileService: ProfileService) {}

//   ngOnInit() {
//     this.loadProfile();
//   }

//   loadProfile() {
//     this.profileService.getProfile().subscribe({
//       next: (res: any) => {
//         this.user = res.user;
//         this.stats = res.stats;
//         this.topGenres = res.topGenres;

//         this.createPieChart();
//       },
//       error: err => console.error("Profile load failed", err)
//     });
//   }

//   createPieChart() {
//     const labels = this.topGenres.map(
//       g => this.genreMap[g.genreId] || `Genre ${g.genreId}`
//     );

//     const data = this.topGenres.map(g => g.count);

//     if (this.chart) {
//       this.chart.destroy(); // prevent duplicate charts
//     }

//     this.chart = new Chart('genrePieChart', {
//       type: 'pie',
//       data: {
//         labels,
//         datasets: [{
//           data,
//           backgroundColor: [
//             '#22c55e', // Adventure
//             '#38bdf8', // Fantasy
//             '#a855f7', // Sci-Fi
//             '#f97316', // Drama
//             '#ef4444'  // Thriller
//           ]
//         }]
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           legend: {
//             position: 'right',
//             labels: {
//               color: '#e5edff'
//             }
//           }
//         }
//       }
//     });
//   }
// }

// import {
//   Component,
//   OnInit,
//   ViewChild,
//   ElementRef
// } from '@angular/core';
// import { ProfileService } from '../../api/profile.service';
// import { Chart } from 'chart.js/auto';

// @Component({
//   selector: 'app-profile',
//   templateUrl: './profile.component.html',
//   styleUrl: './profile.component.scss'
// })
// export class ProfileComponent implements OnInit {

//   user: any = null;
//   stats: any = null;
//   topGenres: any[] = [];
//   chart: Chart | null = null;

//   @ViewChild('genreChart') genreChart!: ElementRef<HTMLCanvasElement>;

//   genreMap: any = {
//     12: 'Adventure',
//     14: 'Fantasy',
//     878: 'Sci-Fi',
//     18: 'Drama',
//     53: 'Thriller'
//   };

//   constructor(private profileService: ProfileService) {}

//   ngOnInit() {
//     this.loadProfile();
//   }

//   loadProfile() {
//     this.profileService.getProfile().subscribe({
//       next: (res: any) => {
//         this.user = res.user;
//         this.stats = res.stats;
//         this.topGenres = res.topGenres;

//         // ⏳ Wait for DOM to render
//         setTimeout(() => this.createPieChart(), 0);
//       },
//       error: err => console.error("Profile load failed", err)
//     });
//   }

//   createPieChart() {
//     if (!this.genreChart) return;

//     const labels = this.topGenres.map(
//       g => this.genreMap[g.genreId] || `Genre ${g.genreId}`
//     );

//     const data = this.topGenres.map(g => g.count);

//     if (this.chart) {
//       this.chart.destroy();
//     }

//     this.chart = new Chart(this.genreChart.nativeElement, {
//       type: 'pie',
//       data: {
//         labels,
//         datasets: [{
//           data,
//           backgroundColor: [
//             '#22c55e', // Adventure
//             '#38bdf8', // Fantasy
//             '#a855f7', // Sci-Fi
//             '#f97316', // Drama
//             '#ef4444'  // Thriller
//           ]
//         }]
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           legend: {
//             position: 'right',
//             labels: {
//               color: '#e5edff'
//             }
//           }
//         }
//       }
//     });
//   }
// }


import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ProfileService } from '../../api/profile.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  user: any = null;
  stats: any = null;
  topGenres: any[] = [];
  chart!: Chart;

  @ViewChild('genreChart', { static: true })
  genreChart!: ElementRef<HTMLCanvasElement>;

  genreMap: any = {
    12: 'Adventure',
    14: 'Fantasy',
    878: 'Sci-Fi',
    18: 'Drama',
    53: 'Thriller'
  };

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getProfile().subscribe({
      next: (res: any) => {
        this.user = res.user;
        this.stats = res.stats;
        this.topGenres = res.topGenres;

        this.createPieChart(); // ✅ SAFE now
      },
      error: err => console.error(err)
    });
  }

  createPieChart() {
    if (!this.topGenres.length) return;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.genreChart.nativeElement, {
      type: 'pie',
      data: {
        labels: this.topGenres.map(
          g => this.genreMap[g.genreId] || `Genre ${g.genreId}`
        ),
        datasets: [{
          data: this.topGenres.map(g => g.count),
          backgroundColor: [
            '#22c55e',
            '#38bdf8',
            '#a855f7',
            '#f97316',
            '#ef4444'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#e5edff' }
          }
        }
      }
    });
  }
}
