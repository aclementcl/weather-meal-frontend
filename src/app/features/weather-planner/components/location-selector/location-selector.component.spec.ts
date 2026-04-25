import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationSelectorComponent } from './location-selector.component';

describe('LocationSelectorComponent', () => {
  let fixture: ComponentFixture<LocationSelectorComponent>;
  let componentRef: ComponentRef<LocationSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationSelectorComponent);
    componentRef = fixture.componentRef;
  });

  it('should render locations as select options', () => {
    componentRef.setInput('isLoading', false);
    componentRef.setInput('errorMessage', '');
    componentRef.setInput('selectedRegionId', 'metropolitana-de-santiago');
    componentRef.setInput('selectedCity', 'Santiago');
    componentRef.setInput('regions', [
      {
        id: 'metropolitana-de-santiago',
        name: 'Metropolitana de Santiago',
      },
    ]);
    componentRef.setInput('locations', [
      {
        id: 'santiago',
        name: 'Santiago',
        regionId: 'metropolitana-de-santiago',
        regionName: 'Metropolitana de Santiago',
        latitude: -33.4489,
        longitude: -70.6693,
      },
    ]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('option')?.textContent).toContain('Santiago');
  });
});
