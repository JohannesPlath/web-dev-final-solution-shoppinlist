import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { ShoppingListEntity } from '../shopping-list/shopping-list.entity';

@Entity()
export class UserEntity extends BaseEntity {


  @Column({ type: 'varchar', length: 40 })
  famName: string;

  @Column({ type: 'varchar', length: 40 })
  givenName: string;

  @Column({ type: 'varchar', length: 40 })
  email: string;

  @Column({ type: 'varchar', length: 30 })
  password: string;


  @OneToMany(() => ShoppingListEntity, list => list.creator)
  lists: ShoppingListEntity;


}

/* @ManyToMany(() => ShoppingListEntity, wasAddedToList => wasAddedToList.addedUserInList)
  @JoinTable()
  areAddedToList: ShoppingListEntity[];

   @ManyToMany(() => ShoppingListEntity, shoppingEntity => shoppingEntity.addedUserInList, {
    cascade: true,
  })
  @JoinTable()
  areAddedToList: ShoppingListEntity[];


  */