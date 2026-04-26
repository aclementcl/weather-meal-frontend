import { Component, input, output } from '@angular/core';
import { FavoriteMenu } from '../../../../core/models/menu.model';

@Component({
  selector: 'app-favorites-list',
  templateUrl: './favorites-list.component.html',
  styleUrl: './favorites-list.component.css',
})
export class FavoritesListComponent {
  readonly favorites = input<FavoriteMenu[]>([]);
  readonly isLoading = input(false);
  readonly deletingFavoriteId = input<number | undefined>(undefined);
  readonly errorMessage = input('');
  readonly deleteFavorite = output<number>();
}
