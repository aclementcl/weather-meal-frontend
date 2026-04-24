import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuSuggestionComponent } from './menu-suggestion.component';

describe('MenuSuggestionComponent', () => {
  let fixture: ComponentFixture<MenuSuggestionComponent>;
  let componentRef: ComponentRef<MenuSuggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuSuggestionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuSuggestionComponent);
    componentRef = fixture.componentRef;
  });

  it('should render breakfast, lunch and dinner', () => {
    componentRef.setInput('canRequest', true);
    componentRef.setInput('menuSuggestion', {
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
    });
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent as string;
    expect(textContent).toContain('Avena con fruta');
    expect(textContent).toContain('Ensalada tibia de quinoa');
    expect(textContent).toContain('Sopa de verduras');
  });

  it('should emit when the user requests a menu', () => {
    componentRef.setInput('canRequest', true);
    spyOn(fixture.componentInstance.requestMenu, 'emit');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;
    button.click();

    expect(fixture.componentInstance.requestMenu.emit).toHaveBeenCalled();
  });

  it('should disable the action when menu cannot be requested', () => {
    componentRef.setInput('canRequest', false);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;
    expect(button.disabled).toBeTrue();
  });
});
