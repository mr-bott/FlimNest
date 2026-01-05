import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WatchProviderService {

  private apiKey = environment.tmdbApiKey;
  private BASE_URL = environment.baseUrl;
  private IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w92';

  constructor(private http: HttpClient) {}

  /**
   * mediaType: 'movie' | 'tv'
   */
  getAvailability(
    mediaType: 'movie' | 'tv',
    mediaId: number
  ) {
    return this.http.get<any>(
      `${this.BASE_URL}/${mediaType}/${mediaId}/watch/providers`,
      {
        params: {
          api_key: this.apiKey
        }
      }
    ).pipe(
      map(res => this.formatResponse(res, mediaId))
    );
  }

  private formatResponse(res: any, mediaId: number) {
    const results = res?.results || {};
    const countries = ['US', 'IN'];

    const availability: any = {};

    countries.forEach(country => {
      availability[country] = {
        flatrate: this.mapProviders(results[country]?.flatrate),
        rent: this.mapProviders(results[country]?.rent),
        buy: this.mapProviders(results[country]?.buy)
      };
    });

    return {
      mediaId,
      availability
    };
  }

  private mapProviders(providers: any[] = []) {
    return providers.map(p => ({
      id: p.provider_id,
      name: p.provider_name,
      logo: p.logo_path
        ? `${this.IMAGE_BASE_URL}${p.logo_path}`
        : null
    }));
  }
}
