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
//   chart!: Chart;

//   @ViewChild('genreChart', { static: true })
//   genreChart!: ElementRef<HTMLCanvasElement>;

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
//         console.log('Profile data loaded:', res);
//         this.user = res.user;
//         this.stats = res.stats;
//         this.topGenres = res.topGenres;
//         this.createPieChart(); // ✅ SAFE now
        
//       },
//       error: err => console.error(err)
//     });
//   }

//   createPieChart() {
//     if (!this.topGenres.length) return;

//     if (this.chart) {
//       this.chart.destroy();
//     }

//     this.chart = new Chart(this.genreChart.nativeElement, {
//       type: 'pie',
//       data: {
//         labels: this.topGenres.map(
//           g => this.genreMap[g.genreId] || `Genre ${g.genreId}`
//         ),
//         datasets: [{
//           data: this.topGenres.map(g => g.count),
//           backgroundColor: [
//             '#22c55e',
//             '#38bdf8',
//             '#a855f7',
//             '#f97316',
//             '#ef4444'
//           ]
//         }]
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           legend: {
//             position: 'right',
//             labels: { color: '#e5edff' }
//           }
//         }
//       }
//     });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../api/profile.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {

  user: any = null;
  stats: any = null;
  topGenres: any[] = [];
  chart!: Chart;

  genreMap: any = {
    12: 'Adventure',
    14: 'Fantasy',
    878: 'Sci-Fi',
    18: 'Drama',
    53: 'Thriller',
  };

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getProfile().subscribe({
      next: (res: any) => {
        this.user = res.user;
        this.stats = res.stats;
        this.topGenres = res.topGenres;

        setTimeout(() => {
          this.createPieChart();
        });
      },
    });
  }

  createPieChart() {
    if (!this.topGenres.length) return;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart("piechart", {
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
            '#ef4444',
          ],
        }],
      },
    });
  }
}

