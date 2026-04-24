import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LocationsApiService } from '../../../../core/services/locations-api.service';
import { WeatherPlannerPageComponent } from './weather-planner-page.component';

describe('WeatherPlannerPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherPlannerPageComponent],
      providers: [
        {
          provide: LocationsApiService,
          useValue: {
            getLocations: () =>
              of([
                {
                  name: 'Santiago',
                  region: 'Metropolitana de Santiago',
                  latitude: -33.4489,
                  longitude: -70.6693,
                },
              ]),
          },
        },
      ],
    }).compileComponents();
  });

  it('should render the WeatherMeal title and selected location', () => {
    const fixture = TestBed.createComponent(WeatherPlannerPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Planifica tu menu segun el clima en Chile',
    );
    expect(compiled.querySelector('.selected-location h2')?.textContent).toContain(
      'Santiago',
    );
    expect(compiled.querySelector('input[type="date"]')).toBeTruthy();
    expect(compiled.querySelector('.selected-location')?.textContent).toContain(
      new Date().getFullYear().toString(),
    );
  });
});
