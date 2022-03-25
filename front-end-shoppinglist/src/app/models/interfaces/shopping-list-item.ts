import { User } from './user';
import { ShoppingList } from './shopping-list';

export interface ShoppingListItem {
  id?: string;
  product: string;
  productGroup: string;

  creator?: User['id'];
  partOfListWithId: ShoppingList['id'];
  bought_by?: string;
}
