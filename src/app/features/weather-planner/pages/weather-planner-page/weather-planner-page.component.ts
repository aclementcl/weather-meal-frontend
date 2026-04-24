import { Component, OnInit, computed, signal } from '@angular/core';
import { Location } from '../../../../core/models/location.model';
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
  protected readonly preferenceOptions: PreferenceOption[] = [
    { value: 'vegetarian', label: 'Vegetariano' },
    { value: 'gluten-free', label: 'Sin gluten' },
    { value: 'dairy-free', label: 'Sin lacteos' },
    { value: 'high-protein', label: 'Alto en proteina' },
  ];
  protected readonly selectedCity = signal('');
  protected readonly selectedDate = signal(this.today);
  protected readonly selectedPreferences = signal<string[]>([]);
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
    this.locationsApi.getLocations().subscribe({
      next: (locations) => {
        this.locations.set(locations);
        this.selectedCity.set(locations[0]?.name ?? '');
        this.isLoadingLocations.set(false);
        this.loadWeather();
      },
      error: () => {
        this.locationError.set(
          'No se pudo cargar el listado de ciudades. Revisa que el backend Nest este corriendo.',
        );
        this.isLoadingLocations.set(false);
      },
    });
  }

  protected onCityChange(city: string): void {
    this.selectedCity.set(city);
    this.resetMenuSuggestion();
    this.loadWeather();
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
