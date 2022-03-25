import { ShoppingListItem } from './shopping-list-item';
import { UserEntity } from '../user/user.entity';

export interface ShoppingListDTO {
  id?: string;
  title: string;
  items: ShoppingListItem[];
  creator: UserEntity;
  user: UserEntity['id'][];

}
