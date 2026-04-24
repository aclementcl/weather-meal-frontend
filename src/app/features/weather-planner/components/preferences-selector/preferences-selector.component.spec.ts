import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreferencesSelectorComponent } from './preferences-selector.component';

describe('PreferencesSelectorComponent', () => {
  let fixture: ComponentFixture<PreferencesSelectorComponent>;
  let componentRef: ComponentRef<PreferencesSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferencesSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreferencesSelectorComponent);
    componentRef = fixture.componentRef;
    componentRef.setInput('options', [
      { value: 'vegetarian', label: 'Vegetariano' },
      { value: 'gluten-free', label: 'Sin gluten' },
    ]);
    componentRef.setInput('selectedPreferences', []);
  });

  it('should render preference options', () => {
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent as string;
    expect(textContent).toContain('Vegetariano');
    expect(textContent).toContain('Sin gluten');
  });

  it('should emit selected preferences when checked', () => {
    spyOn(fixture.componentInstance.selectedPreferencesChange, 'emit');
    fixture.detectChanges();

    const checkbox = fixture.nativeElement.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));

    expect(
      fixture.componentInstance.selectedPreferencesChange.emit,
    ).toHaveBeenCalledWith(['vegetarian']);
  });
});
