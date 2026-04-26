import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, of } from 'rxjs';
import { Location, Region } from '../models/location.model';

@Injectable({
  providedIn: 'root',
})
export class LocationsApiService {
  constructor(private readonly http: HttpClient) {}

  getRegions(): Observable<Region[]> {
    return this.http.get<Region[]>('/api/v1/locations/chile/regions');
  }

  getCities(regionId: number): Observable<Location[]> {
    return this.http.get<Location[]>(
      `/api/v1/locations/chile/regions/${regionId}/cities`,
    );
  }

  getAllCities(regions: Region[]): Observable<Location[]> {
    if (!regions.length) {
      return of([]);
    }

    return forkJoin(regions.map((region) => this.getCities(region.id))).pipe(
      map((citiesByRegion) => citiesByRegion.flat()),
    );
  }
}
