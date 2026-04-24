import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrl: './date-selector.component.css',
})
export class DateSelectorComponent {
  readonly selectedDate = input.required<string>();
  readonly minDate = input.required<string>();
  readonly maxDate = input.required<string>();
  readonly dateOptions = input.required<string[]>();
  readonly selectedDateChange = output<string>();

  protected onDateInput(value: string): void {
    if (this.isDateAllowed(value)) {
      this.selectedDateChange.emit(value);
    }
  }

  protected selectDate(value: string): void {
    this.selectedDateChange.emit(value);
  }

  protected isSelected(value: string): boolean {
    return value === this.selectedDate();
  }

  private isDateAllowed(value: string): boolean {
    return value >= this.minDate() && value <= this.maxDate();
  }
}
