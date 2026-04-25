import { Component, OnInit, computed, signal } from '@angular/core';
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
    { value: 'vegetarian', label: 'Vegetariano' },
    { value: 'gluten-free', label: 'Sin gluten' },
    { value: 'dairy-free', label: 'Sin lacteos' },
    { value: 'high-protein', label: 'Alto en proteina' },
  ];
  protected readonly selectedCity = signal('');
  protected readonly selectedDate = signal(this.today);
  protected readonly selectedPreferences = signal<string[]>([]);
  protected readonly selectedRegionId = signal('');
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
    this.locations().find((location) => location.name === this.selectedCity()),
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
          'No se pudo cargar el listado de regiones. Revisa que el backend Nest este corriendo.',
        );
        this.isLoadingLocations.set(false);
      },
    });
  }

  protected onRegionChange(regionId: string): void {
    this.selectedRegionId.set(regionId);
    this.selectedCity.set('');
    this.weather.set(undefined);
    this.weatherError.set('');
    this.resetMenuSuggestion();
    this.loadCities(regionId);
  }

  protected onCityChange(city: string): void {
    this.selectedCity.set(city);
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

    this.locationsApi.getCities().subscribe({
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
    this.selectedRegionId.set(this.regions()[0]?.id ?? '');
    this.loadCities(this.selectedRegionId());
  }

  private loadCities(regionId: string, preferredCity?: string): void {
    this.isLoadingLocations.set(true);
    this.locationError.set('');

    this.locationsApi.getCities(regionId).subscribe({
      next: (locations) => {
        this.locations.set(locations);
        this.selectedCity.set(
          locations.find((location) => location.name === preferredCity)?.name ??
            locations[0]?.name ??
            '',
        );
        this.isLoadingLocations.set(false);
        this.resetMenuSuggestion();
        this.loadWeather();
      },
      error: () => {
        this.locations.set([]);
        this.selectedCity.set('');
        this.weather.set(undefined);
        this.locationError.set(
          'No se pudo cargar el listado de ciudades para la region seleccionada.',
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

  protected onPreferencesChange(preferences: string[]): void {
    this.selectedPreferences.set(preferences);
    this.resetMenuSuggestion();
  }

  protected suggestMenu(): void {
    const city = this.selectedCity();
    const requestId = ++this.menuRequestId;

    if (!city || !this.weather()) {
      return;
    }

    this.isLoadingMenu.set(true);
    this.menuError.set('');

    this.menuApi
      .suggestMenu({
        location: city,
        date: this.selectedDate(),
        preferences: this.selectedPreferences(),
      })
      .subscribe({
        next: (menuSuggestion) => {
          if (requestId !== this.menuRequestId) {
            return;
          }

          this.menuSuggestion.set(menuSuggestion);
          this.isLoadingMenu.set(false);
        },
        error: () => {
          if (requestId !== this.menuRequestId) {
            return;
          }

          this.menuSuggestion.set(undefined);
          this.menuError.set(
            'No se pudo generar una sugerencia de menu para este clima.',
          );
          this.isLoadingMenu.set(false);
        },
      });
  }

  private loadWeather(): void {
    const city = this.selectedCity();
    const requestId = ++this.weatherRequestId;

    if (!city) {
      this.weather.set(undefined);
      return;
    }

    this.isLoadingWeather.set(true);
    this.weatherError.set('');

    this.weatherApi.getWeather(city, this.selectedDate()).subscribe({
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
