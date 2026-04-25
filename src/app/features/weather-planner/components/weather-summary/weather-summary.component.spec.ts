import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherSummaryComponent } from './weather-summary.component';

describe('WeatherSummaryComponent', () => {
  let fixture: ComponentFixture<WeatherSummaryComponent>;
  let componentRef: ComponentRef<WeatherSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherSummaryComponent);
    componentRef = fixture.componentRef;
  });

  it('should render weather summary and temperatures', () => {
    componentRef.setInput('weather', {
      location: {
        id: 'santiago',
        name: 'Santiago',
        regionId: 'metropolitana-de-santiago',
        regionName: 'Metropolitana de Santiago',
        latitude: -33.4489,
        longitude: -70.6693,
      },
      date: '2026-04-24',
      weather: {
        summary: 'Clear sky',
        temperatureMin: 8.4,
        temperatureMax: 22.1,
        weatherCode: 0,
      },
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Clear sky');
    expect(compiled.textContent).toContain('8 C');
    expect(compiled.textContent).toContain('22 C');
  });

  it('should render errors', () => {
    componentRef.setInput('errorMessage', 'No se pudo consultar el clima.');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'No se pudo consultar el clima.',
    );
  });
});
