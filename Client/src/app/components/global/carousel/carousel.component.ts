// import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
// import { trigger, transition, animate, style } from '@angular/animations';
// import { Subscription } from 'rxjs';
// import { Router, NavigationEnd } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { UserActionsService } from '../../../api/userAction.service';

// @Component({
//   selector: 'app-carousel',
//   templateUrl: './carousel.component.html',
//   styleUrls: ['./carousel.component.scss'],
//   animations: [
//     trigger('fade', [
//       transition(':enter', [
//         style({ opacity: 0 }),
//         animate('300ms', style({ opacity: 1 }))
//       ]),
//       transition(':leave', [
//         animate('300ms', style({ opacity: 0 }))
//       ])
//     ])
//   ]
// })

// export class CarouselComponent implements AfterViewInit, OnChanges, OnDestroy {
//   @Input() title!: string;
//   @Input() id!: number | string;
//   @Input() exploreLink!: string;
//   @Input() items: any[] = [];
//   @Input() canNavigateLeft = false;
//   @Input() canNavigateRight = true; // Defaulting to true to enable navigation by default
//   @Input() infoLink!: string;
//   @Input() isCastCarousel = false;
//   @Input() isDefaultCarousel = true;
//   @Input() isExplore = true;
//   @Input() isDefaultExplore = false;

//   @ViewChild('carouselContainer') carouselContainer!: ElementRef;

//   private routerSubscription!: Subscription;
//   constructor(private actionsService: UserActionsService) {}

//   constructor(private router: Router) {
//     // Add window resize listener to update navigation buttons
//     window.addEventListener('resize', this.updateNavigation.bind(this));
//   }

//   ngAfterViewInit() {
//     setTimeout(() => {
//       this.resetCarousel();
//       this.updateNavigation();
//     }, 300); // Increased timeout to ensure elements are fully rendered

//     // Subscribe to router events to reset the carousel on route change
//     this.routerSubscription = this.router.events.subscribe(event => {
//       if (event instanceof NavigationEnd) {
//         this.resetCarousel();
//       }
//     });
//   }

//   ngOnChanges(changes: SimpleChanges) {
//     if (changes['items'] && !changes['items'].firstChange) {
//       this.resetCarousel();
//     }
//   }

//   prevSlide() {
//     if (this.carouselContainer.nativeElement.scrollLeft > 0) {
//       this.carouselContainer.nativeElement.scrollTo({
//         left: this.carouselContainer.nativeElement.scrollLeft - 1000,
//         behavior: 'smooth'
//       });
//       setTimeout(() => {
//         this.updateNavigation();
//       }, 300);
//     }
//   }

//   nextSlide() {
//     if (this.carouselContainer.nativeElement.scrollWidth > this.carouselContainer.nativeElement.scrollLeft + this.carouselContainer.nativeElement.clientWidth) {
//       this.carouselContainer.nativeElement.scrollTo({
//         left: this.carouselContainer.nativeElement.scrollLeft + 1000,
//         behavior: 'smooth'
//       });
//       setTimeout(() => {
//         this.updateNavigation();
//       }, 300);
//     }
//   }

//   private updateNavigation() {
//     const container = this.carouselContainer.nativeElement;
//     const tolerance = 5; // small tolerance to handle rounding issues
//     this.canNavigateLeft = container.scrollLeft > 0;
//     this.canNavigateRight = container.scrollWidth > container.scrollLeft + container.clientWidth + tolerance;
//   }

//   private resetCarousel() {
//     if (this.carouselContainer) {
//       this.carouselContainer.nativeElement.scrollTo({
//         left: 0,
//         behavior: 'smooth'
//       });

//       setTimeout(() => {
//         this.updateNavigation();
//       }, 300);
//     } else {
//       console.warn('Carousel container not found.');
//     }
//   }

//   ngOnDestroy() {
//     if (this.routerSubscription) {
//       this.routerSubscription.unsubscribe();
//     }
//     window.removeEventListener('resize', this.updateNavigation.bind(this));
//   }

//    // ✔ MARK AS WATCHED
//   markAsWatched(item: any, event: Event) {
//     event.preventDefault();
//     event.stopPropagation();

//     const payload = {
//       tmdbId: item.id,
//       mediaType: item.media_type || this.type,
//       title: item.title || item.name,
//       posterPath: item.poster_path,
//       rating: item.vote_average || null,
//       status: 'watched',
//       liked: false,
//       genres: item.genres?.map((g: any) => g.id) || []
//     };

//     this.actionsService.addMedia(payload).subscribe({
//       next: () => {
//         console.log('Marked as watched');
//         // this.getStatus(item.id, this.type); // 🔁 refresh status
//       },
//       error: err => console.error(err)
//     });
//   }

//   // ⏰ ADD TO WATCH LATER
//   addToWatchLater(item: any, event: Event) {
//     event.preventDefault();
//     event.stopPropagation();

//     const payload = {
//       tmdbId: item.id,
//       mediaType: item.media_type || this.type,
//       title: item.title || item.name,
//       posterPath: item.poster_path,
//       genres: item.genre_ids || [],
//       rating: null,
//       status: 'watchlist',
//       liked: false
//     };

//     this.actionsService.addMedia(payload).subscribe({
//       next: () => {
//         console.log('Added to watchlist');
//         this.getStatus(item.id, this.type); // 🔁 refresh status
//       },
//       error: err => console.error(err)
//     });
//   }
// }

import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { UserActionsService } from '../../../api/userAction.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class CarouselComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() title!: string;
  @Input() id!: number | string;
  @Input() exploreLink!: string;
  @Input() items: any[] = [];
  @Input() infoLink!: string;
  @Input() carouselType!: 'watchlist' | 'watched'| 'default';
  @Input() mediaType!: 'movie' | 'tv';
  @Input() isCastCarousel = false;
  @Input() isDefaultCarousel = true;
  @Input() isExplore = true;
  @Input() isDefaultExplore = false;

  canNavigateLeft = false;
  canNavigateRight = true;

  @ViewChild('carouselContainer') carouselContainer!: ElementRef;

  private routerSubscription!: Subscription;

  // store reference for removeEventListener
  private resizeHandler = this.updateNavigation.bind(this);

  constructor(
    private router: Router,
    private actionsService: UserActionsService
  ) {
    window.addEventListener('resize', this.resizeHandler);
  }
  private getTmdbId(item: any): number {
    return Number(item.link?.split('/').pop());
  }

  private getMediaType(item: any): 'movie' | 'tv' {
    return item.link?.includes('/tv/') ? 'tv' : 'movie';
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.resetCarousel();
      this.updateNavigation();
    }, 300);

    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.resetCarousel();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items'] && !changes['items'].firstChange) {
      this.resetCarousel();
    }
  }

  prevSlide() {
    const el = this.carouselContainer.nativeElement;
    el.scrollTo({ left: el.scrollLeft - 1000, behavior: 'smooth' });
    setTimeout(() => this.updateNavigation(), 300);
  }

  nextSlide() {
    const el = this.carouselContainer.nativeElement;
    el.scrollTo({ left: el.scrollLeft + 1000, behavior: 'smooth' });
    setTimeout(() => this.updateNavigation(), 300);
  }

  private updateNavigation() {
    const el = this.carouselContainer?.nativeElement;
    if (!el) return;

    const tolerance = 5;
    this.canNavigateLeft = el.scrollLeft > 0;
    this.canNavigateRight =
      el.scrollWidth > el.scrollLeft + el.clientWidth + tolerance;
  }

  private resetCarousel() {
    if (!this.carouselContainer) return;

    this.carouselContainer.nativeElement.scrollTo({
      left: 0,
      behavior: 'smooth',
    });

    setTimeout(() => this.updateNavigation(), 300);
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
    window.removeEventListener('resize', this.resizeHandler);
  }

  showWatchedBtn(item: any) {
  return (
    (this.carouselType === 'watchlist' || this.carouselType === 'default') &&
    item.status !== 'watched'
  );
}

showWatchLaterBtn(item: any) {
  return this.carouselType === 'default' && !item.status;
}

showLikeBtn() {
  return this.carouselType === 'watched';
}

showDeleteBtn() {
  return this.carouselType === 'watched' || this.carouselType === 'watchlist';
}


  markAsWatched(item: any, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const payload = {
      tmdbId: this.getTmdbId(item),
      mediaType: this.getMediaType(item),
      title: item.title || item.name,
      posterPath: item.imgSrc,
      rating: item.vote || null,
      status: 'watched',
      liked: false,
      genres: [],
    };

    console.log('Mark watched payload:', payload);

    this.actionsService.addMedia(payload).subscribe({
      next: () => {
        item.status = 'watched';
        console.log('Marked as watched');
      },
      error: (err) => console.error(err),
    });
  }
  addToWatchLater(item: any, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const payload = {
      tmdbId: this.getTmdbId(item),
      mediaType: this.getMediaType(item),
      title: item.title || item.name,
      posterPath: item.imgSrc,
      rating: null,
      status: 'watchlist',
      liked: false,
      genres: [],
    };

    console.log('Adding to watchlist with payload:', payload);

    this.actionsService.addMedia(payload).subscribe({
      next: () => {
        item.status = 'watchlist'; // UI update
        console.log('Added to watchlist');
      },
      error: (err) => console.error(err),
    });
  }
//   toggleLike(item: any, event: Event) {
//   event.preventDefault();
//   event.stopPropagation();

//   const payload = {
//     tmdbId: item.tmdbId || item.id,
//     liked: !item.liked
//   };

//   this.actionsService.toggleLike(payload).subscribe({
//     next: () => {
//       item.liked = !item.liked; // ✅ update UI
//       console.log('Like toggled');
//     },
//     error: err => console.error(err)
//   });
// }

}
