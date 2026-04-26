import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  MenuSuggestRequest,
  MenuSuggestResponse,
} from '../models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class MenuApiService {
  constructor(private readonly http: HttpClient) {}

  suggestMenu(
    cityId: number,
    request: MenuSuggestRequest,
  ): Observable<MenuSuggestResponse> {
    return this.http.post<MenuSuggestResponse>(
      `/api/v1/locations/chile/cities/${cityId}/menu-suggestions`,
      request,
    );
  }
}
