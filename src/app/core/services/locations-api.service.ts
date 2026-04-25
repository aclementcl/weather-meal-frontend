import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Location, Region } from '../models/location.model';

@Injectable({
  providedIn: 'root',
})
export class LocationsApiService {
  constructor(private readonly http: HttpClient) {}

  getRegions(): Observable<Region[]> {
    return this.http.get<Region[]>('/api/v1/locations/chile/regions');
  }

  getCities(regionId?: string): Observable<Location[]> {
    const options = regionId
      ? { params: new HttpParams().set('regionId', regionId) }
      : undefined;

    return this.http.get<Location[]>('/api/v1/locations/chile/cities', options);
  }
}
