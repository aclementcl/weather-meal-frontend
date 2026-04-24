import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Location } from '../../../../core/models/location.model';

@Component({
  selector: 'app-location-selector',
  imports: [FormsModule],
  templateUrl: './location-selector.component.html',
  styleUrl: './location-selector.component.css',
})
export class LocationSelectorComponent {
  readonly locations = input.required<Location[]>();
  readonly selectedCity = input.required<string>();
  readonly isLoading = input(false);
  readonly errorMessage = input('');
  readonly selectedCityChange = output<string>();
}
