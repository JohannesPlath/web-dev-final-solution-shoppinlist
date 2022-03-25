import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { UserEntity } from '../user/user.entity';
import { ItemEntity } from '../items/items.entity';

@Entity()
export class ShoppingListEntity extends BaseEntity {


  @Column({ type: 'varchar', length: 40 })
  title: string; // Id

  @Column('simple-array')
  users: string[];

  @ManyToOne(() => UserEntity, user => user.lists, { onDelete: 'CASCADE' })
  creator: UserEntity;

  @OneToMany(() => ItemEntity, item => item.partOfListWithId)
  items: ItemEntity[];


}

/*@ManyToMany(() => UserEntity, user => user.areAddedToList, { cascade: true })
  addedUserInList: UserEntity[];

 @ManyToMany(() => UserEntity, user => user.areAddedToList)
  addedUserInList: UserEntity[];

*/