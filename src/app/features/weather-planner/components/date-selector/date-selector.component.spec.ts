import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateSelectorComponent } from './date-selector.component';

describe('DateSelectorComponent', () => {
  let fixture: ComponentFixture<DateSelectorComponent>;
  let componentRef: ComponentRef<DateSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DateSelectorComponent);
    componentRef = fixture.componentRef;
    componentRef.setInput('selectedDate', '2026-04-24');
    componentRef.setInput('minDate', '2026-04-24');
    componentRef.setInput('maxDate', '2026-04-30');
  });

  it('should limit the date input to the allowed range', () => {
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      'input[type="date"]',
    ) as HTMLInputElement;
    expect(input.min).toBe('2026-04-24');
    expect(input.max).toBe('2026-04-30');
  });

  it('should emit dates inside the allowed range', () => {
    spyOn(fixture.componentInstance.selectedDateChange, 'emit');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      'input[type="date"]',
    ) as HTMLInputElement;
    input.value = '2026-04-27';
    input.dispatchEvent(new Event('change'));

    expect(fixture.componentInstance.selectedDateChange.emit).toHaveBeenCalledWith(
      '2026-04-27',
    );
  });

  it('should block dates outside the allowed range', () => {
    spyOn(fixture.componentInstance.selectedDateChange, 'emit');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      'input[type="date"]',
    ) as HTMLInputElement;
    input.value = '2026-05-01';
    input.dispatchEvent(new Event('change'));

    expect(fixture.componentInstance.selectedDateChange.emit).not.toHaveBeenCalled();
  });
});
