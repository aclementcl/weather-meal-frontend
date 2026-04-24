import { Component, input } from '@angular/core';
import { WeatherResponse } from '../../../../core/models/weather.model';

@Component({
  selector: 'app-weather-summary',
  templateUrl: './weather-summary.component.html',
  styleUrl: './weather-summary.component.css',
})
export class WeatherSummaryComponent {
  readonly weather = input<WeatherResponse | undefined>();
  readonly isLoading = input(false);
  readonly errorMessage = input('');

  protected readonly Math = Math;
}
