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
  @Input() carouselType!: 'watchlist' | 'watched' | 'default'| 'liked';
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
    private actionsService: UserActionsService,
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

  showLikeBtn(item:any) {
    return this.carouselType === 'watched' && item.liked===false;
  }
  
  showUnLikeBtn(item:any) {
    return item.liked===true;
  }

  showDeleteBtn() {
    return (this.carouselType === 'watched' || this.carouselType === 'watchlist') ;
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

    this.actionsService.addMedia(payload).subscribe({
      next: () => {
        item.status = 'watched';
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

    this.actionsService.addMedia(payload).subscribe({
      next: () => {
        item.status = 'watchlist'; // UI update
      },
      error: (err) => console.error(err),
    });
  }
  toggleLike(item: any, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const payload = {
      tmdbId: this.getTmdbId(item),
      liked: !item.liked,
    };

    this.actionsService.toggleLike(payload).subscribe({
      next: () => {
        item.liked = !item.liked;
      },

      error: (err) => console.error(err),
    });
  }
}
