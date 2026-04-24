import { Location } from './location.model';

export interface WeatherSummary {
  summary: string;
  temperatureMin: number;
  temperatureMax: number;
  weatherCode?: number;
}

export interface WeatherResponse {
  location: Location;
  date: string;
  weather: WeatherSummary;
}
