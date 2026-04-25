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
  readonly selectedDateChange = output<string>();

  protected onDateInput(value: string): void {
    if (this.isDateAllowed(value)) {
      this.selectedDateChange.emit(value);
    }
  }

  private isDateAllowed(value: string): boolean {
    return value >= this.minDate() && value <= this.maxDate();
  }
}
