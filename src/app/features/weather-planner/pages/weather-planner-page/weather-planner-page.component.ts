import { Component, OnInit, computed, signal } from '@angular/core';
import { Location } from '../../../../core/models/location.model';
import { LocationsApiService } from '../../../../core/services/locations-api.service';
import { LocationSelectorComponent } from '../../components/location-selector/location-selector.component';

@Component({
  selector: 'app-weather-planner-page',
  imports: [LocationSelectorComponent],
  templateUrl: './weather-planner-page.component.html',
  styleUrl: './weather-planner-page.component.css',
})
export class WeatherPlannerPageComponent implements OnInit {
  protected readonly locations = signal<Location[]>([]);
  protected readonly selectedCity = signal('');
  protected readonly isLoadingLocations = signal(true);
  protected readonly locationError = signal('');

  protected readonly selectedLocation = computed(() =>
    this.locations().find((location) => location.name === this.selectedCity()),
  );

  constructor(private readonly locationsApi: LocationsApiService) {}

  ngOnInit(): void {
    this.locationsApi.getLocations().subscribe({
      next: (locations) => {
        this.locations.set(locations);
        this.selectedCity.set(locations[0]?.name ?? '');
        this.isLoadingLocations.set(false);
      },
      error: () => {
        this.locationError.set(
          'No se pudo cargar el listado de ciudades. Revisa que el backend Nest este corriendo.',
        );
        this.isLoadingLocations.set(false);
      },
    });
  }
}
