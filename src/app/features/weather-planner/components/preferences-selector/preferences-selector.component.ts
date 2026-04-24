import { Component, input, output } from '@angular/core';
import { PreferenceOption } from '../../models/preference-option.model';

@Component({
  selector: 'app-preferences-selector',
  templateUrl: './preferences-selector.component.html',
  styleUrl: './preferences-selector.component.css',
})
export class PreferencesSelectorComponent {
  readonly options = input.required<PreferenceOption[]>();
  readonly selectedPreferences = input.required<string[]>();
  readonly selectedPreferencesChange = output<string[]>();

  protected isSelected(value: string): boolean {
    return this.selectedPreferences().includes(value);
  }

  protected togglePreference(value: string, checked: boolean): void {
    const selected = new Set(this.selectedPreferences());

    if (checked) {
      selected.add(value);
    } else {
      selected.delete(value);
    }

    this.selectedPreferencesChange.emit([...selected]);
  }
}
