import { Component, OnInit, computed, signal } from '@angular/core';
import { Location } from '../../../../core/models/location.model';
import { LocationsApiService } from '../../../../core/services/locations-api.service';
import { DateSelectorComponent } from '../../components/date-selector/date-selector.component';
import { LocationSelectorComponent } from '../../components/location-selector/location-selector.component';

@Component({
  selector: 'app-weather-planner-page',
  imports: [DateSelectorComponent, LocationSelectorComponent],
  templateUrl: './weather-planner-page.component.html',
  styleUrl: './weather-planner-page.component.css',
})
export class WeatherPlannerPageComponent implements OnInit {
  private readonly today = this.toIsoDate(new Date());

  protected readonly locations = signal<Location[]>([]);
  protected readonly selectedCity = signal('');
  protected readonly selectedDate = signal(this.today);
  protected readonly isLoadingLocations = signal(true);
  protected readonly locationError = signal('');
  protected readonly dateOptions = this.buildDateOptions();
  protected readonly minDate = this.dateOptions[0];
  protected readonly maxDate = this.dateOptions[this.dateOptions.length - 1];

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

  private buildDateOptions(): string[] {
    return Array.from({ length: 7 }, (_, offset) => {
      const date = new Date();
      date.setDate(date.getDate() + offset);

      return this.toIsoDate(date);
    });
  }

  private toIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
