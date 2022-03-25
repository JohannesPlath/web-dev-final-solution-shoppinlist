import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { UserEntity } from '../user/user.entity';
import { ShoppingListEntity } from '../shopping-list/shopping-list.entity';

@Entity()
export class ItemEntity extends BaseEntity {

  @Column({ type: 'varchar', length: 40 })
  product: string;

  @Column({ type: 'varchar', length: 40 })
  productGroup: string;

  @Column({ type: 'varchar', length: 40 })
  creator: UserEntity['id'];

  @Column({ type: 'varchar', length: 50, nullable: true })
  bought_by?: string; //todoChangeToMail

  @ManyToOne(() => ShoppingListEntity, shoppingList => shoppingList.items, { onDelete: 'CASCADE' })
  partOfListWithId: ShoppingListEntity;

  /*@ManyToOne(() => ShoppingListEntity, shoppingList => shoppingList.users)
  partOfUsersInList: ShoppingListEntity;*/

  @ManyToOne(() => UserEntity, user => user.lists, { onDelete: 'CASCADE' })
  user: UserEntity;
}

