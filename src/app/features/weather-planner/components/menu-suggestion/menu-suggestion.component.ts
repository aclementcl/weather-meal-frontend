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
  readonly isSavingFavorite = input(false);
  readonly errorMessage = input('');
  readonly favoriteMessage = input('');
  readonly favoriteErrorMessage = input('');
  readonly canRequest = input(false);
  readonly requestMenu = output<void>();
  readonly saveFavorite = output<void>();
}
