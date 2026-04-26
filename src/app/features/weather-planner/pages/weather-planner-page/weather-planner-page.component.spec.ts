import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LocationsApiService } from '../../../../core/services/locations-api.service';
import { MenuApiService } from '../../../../core/services/menu-api.service';
import { WeatherApiService } from '../../../../core/services/weather-api.service';
import { WeatherPlannerPageComponent } from './weather-planner-page.component';

describe('WeatherPlannerPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherPlannerPageComponent],
      providers: [
        {
          provide: LocationsApiService,
          useValue: {
            getRegions: () =>
              of([
                {
                  id: 7,
                  name: 'Metropolitana de Santiago',
                },
              ]),
            getCities: () =>
              of([
                {
                  id: 13,
                  name: 'Santiago',
                  regionId: 7,
                  regionName: 'Metropolitana de Santiago',
                  latitude: -33.4489,
                  longitude: -70.6693,
                },
              ]),
          },
        },
        {
          provide: MenuApiService,
          useValue: {
            suggestMenu: () =>
              of({
                location: 'Santiago',
                date: '2026-04-24',
                weather: {
                  summary: 'Clear sky',
                  temperatureMin: 8,
                  temperatureMax: 22,
                },
                menu: {
                  breakfast: 'Avena con fruta',
                  lunch: 'Ensalada tibia de quinoa',
                  dinner: 'Sopa de verduras',
                },
              }),
          },
        },
        {
          provide: WeatherApiService,
          useValue: {
            getWeather: () =>
              of({
                location: {
                  id: 13,
                  name: 'Santiago',
                  regionId: 7,
                  regionName: 'Metropolitana de Santiago',
                  latitude: -33.4489,
                  longitude: -70.6693,
                },
                date: '2026-04-24',
                weather: {
                  summary: 'Clear sky',
                  temperatureMin: 8,
                  temperatureMax: 22,
                  weatherCode: 0,
                },
              }),
          },
        },
      ],
    }).compileComponents();
  });

  it('should render the planning flow', () => {
    const fixture = TestBed.createComponent(WeatherPlannerPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Planifica tu menú según el clima en Chile',
    );
    expect(compiled.querySelector('.planner-panel')).toBeTruthy();
    expect(compiled.querySelector('.selected-location')).toBeFalsy();
    expect(compiled.querySelector('input[type="date"]')).toBeTruthy();
    expect(compiled.querySelector('app-weather-summary')?.textContent).toContain(
      'Clear sky',
    );
    expect(compiled.querySelector('app-menu-suggestion')?.textContent).toContain(
      'Sugerir menú',
    );
    expect(
      compiled.querySelector('app-preferences-selector')?.textContent,
    ).toContain('Vegetariano');
  });
});
