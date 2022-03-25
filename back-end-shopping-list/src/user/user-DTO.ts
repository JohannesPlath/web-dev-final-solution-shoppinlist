import { ShoppingListEntity } from '../shopping-list/shopping-list.entity';

export interface UserDTO {
  id?: string;
  famName?: string;
  givenName?: string;
  email?: string;
  password?: string;
  lists?: ShoppingListEntity;
}