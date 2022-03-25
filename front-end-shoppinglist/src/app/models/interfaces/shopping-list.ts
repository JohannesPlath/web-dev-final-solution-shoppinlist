import { ShoppingListItem } from './shopping-list-item';

export interface ShoppingList {

  title: string;
  items: ShoppingListItem[];
  creator: string;
  users?: string[];
  id?: string;

}
