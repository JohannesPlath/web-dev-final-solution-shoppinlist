import { ShoppingListDTO } from '../shopping-list/shopping-list-DTO';

export interface AddUserToListDTO {
  list: ShoppingListDTO[];
  userMail: string;
}
