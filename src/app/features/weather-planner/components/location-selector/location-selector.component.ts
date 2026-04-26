import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Location, Region } from '../../../../core/models/location.model';

@Component({
  selector: 'app-location-selector',
  imports: [FormsModule],
  templateUrl: './location-selector.component.html',
  styleUrl: './location-selector.component.css',
})
export class LocationSelectorComponent {
  readonly regions = input.required<Region[]>();
  readonly locations = input.required<Location[]>();
  readonly selectedRegionId = input.required<number | undefined>();
  readonly selectedCityId = input.required<number | undefined>();
  readonly isLoading = input(false);
  readonly errorMessage = input('');
  readonly selectedRegionChange = output<number>();
  readonly selectedCityChange = output<number>();
}
