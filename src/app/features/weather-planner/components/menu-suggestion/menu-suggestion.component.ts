import { Component, input, output } from '@angular/core';
import { MenuSuggestResponse } from '../../../../core/models/menu.model';

@Component({
  selector: 'app-menu-suggestion',
  templateUrl: './menu-suggestion.component.html',
  styleUrl: './menu-suggestion.component.css',
})
export class MenuSuggestionComponent {
  readonly menuSuggestion = input<MenuSuggestResponse | undefined>();
  readonly isLoading = input(false);
  readonly errorMessage = input('');
  readonly canRequest = input(false);
  readonly requestMenu = output<void>();
}
