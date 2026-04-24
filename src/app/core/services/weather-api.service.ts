import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherResponse } from '../models/weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherApiService {
  constructor(private readonly http: HttpClient) {}

  getWeather(city: string, date: string): Observable<WeatherResponse> {
    const params = new HttpParams().set('city', city).set('date', date);

    return this.http.get<WeatherResponse>('/api/v1/weather', { params });
  }
}
