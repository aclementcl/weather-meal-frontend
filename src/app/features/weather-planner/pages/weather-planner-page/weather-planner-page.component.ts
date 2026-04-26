import { Component, OnInit, computed, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Location, Region } from '../../../../core/models/location.model';
import { MenuSuggestResponse } from '../../../../core/models/menu.model';
import { WeatherResponse } from '../../../../core/models/weather.model';
import { LocationsApiService } from '../../../../core/services/locations-api.service';
import { MenuApiService } from '../../../../core/services/menu-api.service';
import { WeatherApiService } from '../../../../core/services/weather-api.service';
import { DateSelectorComponent } from '../../components/date-selector/date-selector.component';
import { LocationSelectorComponent } from '../../components/location-selector/location-selector.component';
import { MenuSuggestionComponent } from '../../components/menu-suggestion/menu-suggestion.component';
import { PreferencesSelectorComponent } from '../../components/preferences-selector/preferences-selector.component';
import { PreferenceOption } from '../../models/preference-option.model';
import { WeatherSummaryComponent } from '../../components/weather-summary/weather-summary.component';

@Component({
  selector: 'app-weather-planner-page',
  imports: [
    DateSelectorComponent,
    LocationSelectorComponent,
    MenuSuggestionComponent,
    PreferencesSelectorComponent,
    WeatherSummaryComponent,
  ],
  templateUrl: './weather-planner-page.component.html',
  styleUrl: './weather-planner-page.component.css',
})
export class WeatherPlannerPageComponent implements OnInit {
  private readonly today = this.toIsoDate(new Date());
  private menuRequestId = 0;
  private weatherRequestId = 0;

  protected readonly locations = signal<Location[]>([]);
  protected readonly regions = signal<Region[]>([]);
  protected readonly preferenceOptions: PreferenceOption[] = [
    { id: 1, label: 'Vegetariano' },
    { id: 2, label: 'Sin gluten' },
    { id: 3, label: 'Sin lácteos' },
    { id: 4, label: 'Alto en proteína' },
  ];
  protected readonly selectedCity = signal('');
  protected readonly selectedCityId = signal<number | undefined>(undefined);
  protected readonly selectedDate = signal(this.today);
  protected readonly selectedPreferenceIds = signal<number[]>([]);
  protected readonly selectedRegionId = signal<number | undefined>(undefined);
  protected readonly menuSuggestion = signal<MenuSuggestResponse | undefined>(
    undefined,
  );
  protected readonly weather = signal<WeatherResponse | undefined>(undefined);
  protected readonly isLoadingLocations = signal(true);
  protected readonly isLoadingMenu = signal(false);
  protected readonly isLoadingWeather = signal(false);
  protected readonly locationError = signal('');
  protected readonly menuError = signal('');
  protected readonly weatherError = signal('');
  protected readonly dateOptions = this.buildDateOptions();
  protected readonly minDate = this.dateOptions[0];
  protected readonly maxDate = this.dateOptions[this.dateOptions.length - 1];

  protected readonly selectedLocation = computed(() =>
    this.locations().find((location) => location.id === this.selectedCityId()),
  );
  protected readonly canRequestMenu = computed(
    () => !!this.weather() && !this.isLoadingWeather(),
  );

  constructor(
    private readonly locationsApi: LocationsApiService,
    private readonly menuApi: MenuApiService,
    private readonly weatherApi: WeatherApiService,
  ) {}

  ngOnInit(): void {
    this.locationsApi.getRegions().subscribe({
      next: (regions) => {
        this.regions.set(regions);
        this.initializeLocation();
      },
      error: () => {
        this.locationError.set(
          'No se pudo cargar el listado de regiones. Revisa que el backend Nest esté corriendo.',
        );
        this.isLoadingLocations.set(false);
      },
    });
  }

  protected onRegionChange(regionId: number): void {
    this.selectedRegionId.set(regionId);
    this.selectedCity.set('');
    this.selectedCityId.set(undefined);
    this.weather.set(undefined);
    this.weatherError.set('');
    this.resetMenuSuggestion();
    this.loadCities(regionId);
  }

  protected onCityChange(cityId: number): void {
    const location = this.locations().find((item) => item.id === cityId);

    this.selectedCity.set(location?.name ?? '');
    this.selectedCityId.set(location?.id);
    this.resetMenuSuggestion();
    this.loadWeather();
  }

  private initializeLocation(): void {
    if (!navigator.geolocation) {
      this.loadFallbackCities();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.selectNearestSupportedCity(
          position.coords.latitude,
          position.coords.longitude,
        );
      },
      () => {
        this.loadFallbackCities();
      },
      {
        enableHighAccuracy: false,
        maximumAge: 300000,
        timeout: 5000,
      },
    );
  }

  private selectNearestSupportedCity(latitude: number, longitude: number): void {
    this.isLoadingLocations.set(true);
    this.locationError.set('');

    this.locationsApi.getAllCities(this.regions()).subscribe({
      next: (locations) => {
        const nearestLocation = this.findNearestLocation(
          latitude,
          longitude,
          locations,
        );

        if (!nearestLocation) {
          this.loadFallbackCities();
          return;
        }

        this.selectedRegionId.set(nearestLocation.regionId);
        this.loadCities(nearestLocation.regionId, nearestLocation.name);
      },
      error: () => {
        this.loadFallbackCities();
      },
    });
  }

  private loadFallbackCities(): void {
    this.selectedRegionId.set(this.regions()[0]?.id);

    if (this.selectedRegionId() === undefined) {
      this.isLoadingLocations.set(false);
      return;
    }

    this.loadCities(this.selectedRegionId() as number);
  }

  private loadCities(regionId: number, preferredCity?: string): void {
    this.isLoadingLocations.set(true);
    this.locationError.set('');

    this.locationsApi.getCities(regionId).subscribe({
      next: (locations) => {
        this.locations.set(locations);
        this.selectCity(
          locations.find((location) => location.name === preferredCity) ??
            locations[0],
        );
        this.isLoadingLocations.set(false);
        this.resetMenuSuggestion();
        this.loadWeather();
      },
      error: () => {
        this.locations.set([]);
        this.selectedCity.set('');
        this.selectedCityId.set(undefined);
        this.weather.set(undefined);
        this.locationError.set(
          'No se pudo cargar el listado de ciudades para la región seleccionada.',
        );
        this.isLoadingLocations.set(false);
      },
    });
  }

  private findNearestLocation(
    latitude: number,
    longitude: number,
    locations: Location[],
  ): Location | undefined {
    return locations.reduce<Location | undefined>((nearestLocation, location) => {
      if (!nearestLocation) {
        return location;
      }

      const nearestDistance = this.calculateDistanceInKm(
        latitude,
        longitude,
        nearestLocation.latitude,
        nearestLocation.longitude,
      );
      const locationDistance = this.calculateDistanceInKm(
        latitude,
        longitude,
        location.latitude,
        location.longitude,
      );

      return locationDistance < nearestDistance ? location : nearestLocation;
    }, undefined);
  }

  private calculateDistanceInKm(
    latitudeA: number,
    longitudeA: number,
    latitudeB: number,
    longitudeB: number,
  ): number {
    const earthRadiusInKm = 6371;
    const latitudeDistance = this.toRadians(latitudeB - latitudeA);
    const longitudeDistance = this.toRadians(longitudeB - longitudeA);
    const a =
      Math.sin(latitudeDistance / 2) * Math.sin(latitudeDistance / 2) +
      Math.cos(this.toRadians(latitudeA)) *
        Math.cos(this.toRadians(latitudeB)) *
        Math.sin(longitudeDistance / 2) *
        Math.sin(longitudeDistance / 2);

    return earthRadiusInKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRadians(value: number): number {
    return (value * Math.PI) / 180;
  }

  protected onDateChange(date: string): void {
    this.selectedDate.set(date);
    this.resetMenuSuggestion();
    this.loadWeather();
  }

  protected onPreferencesChange(preferenceIds: number[]): void {
    this.selectedPreferenceIds.set(preferenceIds);
    this.resetMenuSuggestion();
  }

  protected suggestMenu(): void {
    const cityId = this.selectedCityId();
    const requestId = ++this.menuRequestId;

    if (cityId === undefined || !this.weather()) {
      return;
    }

    this.isLoadingMenu.set(true);
    this.menuError.set('');

    this.menuApi
      .suggestMenu(cityId, {
        date: this.selectedDate(),
        preferenceIds: this.selectedPreferenceIds(),
      })
      .subscribe({
        next: (menuSuggestion) => {
          if (requestId !== this.menuRequestId) {
            return;
          }

          this.menuSuggestion.set(menuSuggestion);
          this.isLoadingMenu.set(false);
        },
        error: (error: unknown) => {
          if (requestId !== this.menuRequestId) {
            return;
          }

          this.menuSuggestion.set(undefined);
          this.menuError.set(this.getMenuErrorMessage(error));
          this.isLoadingMenu.set(false);
        },
      });
  }

  private loadWeather(): void {
    const cityId = this.selectedCityId();
    const requestId = ++this.weatherRequestId;

    if (cityId === undefined) {
      this.weather.set(undefined);
      return;
    }

    this.isLoadingWeather.set(true);
    this.weatherError.set('');

    this.weatherApi.getWeather(cityId, this.selectedDate()).subscribe({
      next: (weather) => {
        if (requestId !== this.weatherRequestId) {
          return;
        }

        this.weather.set(weather);
        this.isLoadingWeather.set(false);
      },
      error: () => {
        if (requestId !== this.weatherRequestId) {
          return;
        }

        this.weather.set(undefined);
        this.weatherError.set(
          'No se pudo consultar el clima para la ciudad y fecha seleccionadas.',
        );
        this.isLoadingWeather.set(false);
      },
    });
  }

  private resetMenuSuggestion(): void {
    this.menuRequestId++;
    this.menuSuggestion.set(undefined);
    this.menuError.set('');
    this.isLoadingMenu.set(false);
  }

  private selectCity(location?: Location): void {
    this.selectedCity.set(location?.name ?? '');
    this.selectedCityId.set(location?.id);
  }

  private getMenuErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const backendMessage =
        typeof error.error?.message === 'string' ? error.error.message : '';

      if (backendMessage) {
        return `No se pudo generar el menú: ${backendMessage}.`;
      }
    }

    return 'No se pudo generar una sugerencia de menú para este clima.';
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
