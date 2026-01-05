import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserActionsService {
  private baseUrl = environment.serverUrl;
  constructor(private http: HttpClient) {}

  // ONE API for watched + watchlist
  addMedia(data: any) {
    return this.http.post(`${this.baseUrl}/media`, data, {
      withCredentials: true
    });
  }

  getStatus(tmdbId: number, mediaType: string) {
    return this.http.get<any>(`${this.baseUrl}/media/status/${tmdbId}`, {
      params: { tmdbId, mediaType },
      withCredentials: true
    });
  }
  }