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
    componentRef.setInput('selectedRegionId', 7);
    componentRef.setInput('selectedCityId', 13);
    componentRef.setInput('regions', [
      {
        id: 7,
        name: 'Metropolitana de Santiago',
      },
    ]);
    componentRef.setInput('locations', [
      {
        id: 13,
        name: 'Santiago',
        regionId: 7,
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
