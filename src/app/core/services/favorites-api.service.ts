import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FavoriteMenu, MenuSuggestResponse } from '../models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class FavoritesApiService {
  private readonly baseUrl = '/api/v1/favorites';

  constructor(private readonly http: HttpClient) {}

  getFavorites(): Observable<FavoriteMenu[]> {
    return this.http.get<FavoriteMenu[]>(this.baseUrl);
  }

  saveFavorite(menuSuggestion: MenuSuggestResponse): Observable<FavoriteMenu> {
    return this.http.post<FavoriteMenu>(this.baseUrl, menuSuggestion);
  }

  deleteFavorite(favoriteId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${favoriteId}`);
  }
}
