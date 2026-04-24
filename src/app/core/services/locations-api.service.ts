import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from '../models/location.model';

@Injectable({
  providedIn: 'root',
})
export class LocationsApiService {
  constructor(private readonly http: HttpClient) {}

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>('/api/v1/locations/chile');
  }
}
