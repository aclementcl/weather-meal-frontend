import { Component, input, output } from '@angular/core';
import { PreferenceOption } from '../../models/preference-option.model';

@Component({
  selector: 'app-preferences-selector',
  templateUrl: './preferences-selector.component.html',
  styleUrl: './preferences-selector.component.css',
})
export class PreferencesSelectorComponent {
  readonly options = input.required<PreferenceOption[]>();
  readonly selectedPreferenceIds = input.required<number[]>();
  readonly selectedPreferenceIdsChange = output<number[]>();

  protected isSelected(preferenceId: number): boolean {
    return this.selectedPreferenceIds().includes(preferenceId);
  }

  protected togglePreference(preferenceId: number, checked: boolean): void {
    const selected = new Set(this.selectedPreferenceIds());

    if (checked) {
      selected.add(preferenceId);
    } else {
      selected.delete(preferenceId);
    }

    this.selectedPreferenceIdsChange.emit([...selected]);
  }
}
