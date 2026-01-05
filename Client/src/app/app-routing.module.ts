
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MoviesComponent } from './components/movies/movies.component';
import { TvComponent } from './components/tv/tv.component';
import { MoviesInfoComponent } from './components/movies-info/movies-info.component';
import { TvInfoComponent } from './components/tv-info/tv-info.component';
import { PersonComponent } from './components/person/person.component';
import { MovieCategoryComponent } from './components/movie-category/movie-category.component';
import { TvCategoryComponent } from './components/tv-category/tv-category.component';
import { GenreComponent } from './components/genre/genre.component';
import { SearchComponent } from './components/global/search/search.component';
import { ProfileComponent} from './components/profile/profile.component';
import { LoginComponent } from './login/login.component';
import { OauthSuccessComponent } from './oauth-success/oauth-success.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [

  // 🔓 PUBLIC ROUTES
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'oauth-success',
    component: OauthSuccessComponent,
  },

  // 🔐 PROTECTED ROUTES
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent },
      {path: 'profile', component: ProfileComponent },
      { path: 'movie', component: MoviesComponent },
      { path: 'tv', component: TvComponent },
      { path: 'movie/:id', component: MoviesInfoComponent },
      { path: 'tv/:id', component: TvInfoComponent },
      { path: 'person/:id', component: PersonComponent },
      { path: 'movie/category/:category', component: MovieCategoryComponent },
      { path: 'tv/category/:category', component: TvCategoryComponent },
      { path: 'genres/:id/:type', component: GenreComponent },
      { path: 'search', component: SearchComponent },
    ]
  },

  // ❌ FALLBACK
  {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
