import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, getRepository, Repository } from 'typeorm';
import { ShoppingListEntity } from './shopping-list.entity';
import { UserEntity } from '../user/user.entity';
import { AddUserToListDTO } from '../dto/lists-and-user-to.add-DTO';
import { UserIdDTO } from '../dto/user-id-d-t-o';


@Injectable()
export class ShoppingListService {


  constructor(
    @InjectRepository(ShoppingListEntity)
    private readonly shoppingListRepository: Repository<ShoppingListEntity>,
  ) {
  }


  async deleteList(id) {
    //console.log('shoppingListService @ deleteList', id);
    let shoppingList: ShoppingListEntity = await this.shoppingListRepository.findOne(id);
    //console.log('shoppingListService @ deleteList + shoppingList: ', shoppingList);
    await this.shoppingListRepository.delete(id);
    return shoppingList;
  }

  async createList(list: ShoppingListEntity) {
    //console.log('shopping-list.service createList: ', list);
    const existingList = await this.shoppingListRepository.findOne(this.findListByName(list.title));
    if (existingList) {
      //console.log('shopping-list.service can´t create a new List caused by exiting name: ', list.title);
      return new Promise(function(resolve) {
        if (existingList) {
          resolve(null);
        }
      });
    } else {
      //console.log('shopping-list.service created a new List ');
      return this.shoppingListRepository.save(list);
    }
  }

  async getListById(id: string) {
    //console.log('shopping-list.service getListsById: ', id);
    const listById = await this.shoppingListRepository.findOne(this.findListsById(id));
    //console.log('founded lists by ID: ', listWithItems);
    return await this.shoppingListRepository.findOne({
      where: {
        id: listById.id,
      },
      relations: ['items'],
    });
  }

  async getListsWithItems(id: string) {
    const params = {
      where: { id: id },
      relations: ['items'],
    };
    return await this.shoppingListRepository.findOne(params);
  }

  async getListsOfOwner(id: string): Promise<ShoppingListEntity[]> {
    //console.log('shopping-list.service getListsOfOwner: ', id);
    return await this.shoppingListRepository.find(this.findListsOfOwner(id));
  }

  async getListsOfUser(id: string): Promise<ShoppingListEntity[]> {
    //console.log('shopping-list.service getListsOfUser: ', id);
    const listsOfOwner = await this.shoppingListRepository.find(this.findListsOfOwner(id));
    //console.log('shopping-list.service getListsOfUser founded lists of Owner: ', listsOfOwner);
    const allLists: ShoppingListEntity[] = await this.shoppingListRepository.find();
    //console.log('shopping-list.service getListsOfUser founded lists allLists', allLists);
    const actUser: UserEntity = await this.findUserByID(id);
    //console.log('shoppingList.service founded User by ID:', actUser);
    let ergListArray: ShoppingListEntity[] = [];
    for (let i = 0; i < allLists.length; i++) {
      if (actUser.email) {
        if (allLists[i].users.includes(actUser.email)) {
          ergListArray.push(allLists[i]);
        }
      }
    }
    //console.log('shopping-list.service getListsOfUser founded lists ergListArray:', ergListArray);
    /*let listsOfUser = await this.shoppingListRepository
      .createQueryBuilder('lists')
      .where('lists.users like :users', { users: [actUser.email] })
      .getMany();
    console.log('founded lists of User: ', listsOfUser);
    */
    //console.log('founded lists of combinedLists: ', combinedLists);
    return listsOfOwner.concat(ergListArray);
  }

  /*async addUserToListManyToMany(listsAndUserToAdd: AddUserToListDTO) {
    console.log('shoppingListService + addUserToListManyToMany + listsAndUserToAdd', listsAndUserToAdd);
    const actUser = await this.findUserByMail(listsAndUserToAdd.userMail);
    console.log('shoppingListService + addUserToListManyToMany + actUser', actUser);
    for (let i = 0; i < listsAndUserToAdd.list.length; i++) {
      const list1 = await this.shoppingListRepository.findOne(listsAndUserToAdd.list[i].id);
      console.log('shoppingListService + addUserToListManyToMany + list1', list1);
      actUser.areAddedToList = [list1];
      await this.shoppingListRepository.manager.save(actUser);
      console.log('shoppingListService + addUserToListManyToMany + actUser', actUser);
      const areAddedToList = await getRepository(UserEntity)
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.areAddedToList', 'addedLists')
        .where('user.id = :id', { id: actUser.id })
        .getMany();


      console.log('------------shoppingListService + addUserToListManyToMany + areAddedToList', areAddedToList);
      areAddedToList;
    }
  }*/

  async updateListsWithUserXS(addUserToList: AddUserToListDTO) {
    //console.log('updateListsWithUserXS  addUserToList ', addUserToList);
    const user: UserEntity = await this.findUserByMail(addUserToList.userMail);
    if (!user) {
      return new Promise(function(resolve) {
        resolve(null);
      });
    }
    let actualizedLists: ShoppingListEntity[] = [];
    for (let i = 0; i < addUserToList.list.length; i++) {
      let shoppingListEntity = await this.shoppingListRepository.findOne(this.findListsById(addUserToList.list[i].id));
      //console.log('updateListsWithUserXS  user ', user);
      //console.log('updateListsWithUserXS  shoppingListEntity.creator ', shoppingListEntity);
      /* if (user == shoppingListEntity.creator) {
         console.log('user == creator'); // ggf hier return promise...
       }*/
      const entityManager = getManager();
      if (!shoppingListEntity.users.includes(user.email)) {
        shoppingListEntity.users.push(user.email);
        await entityManager.save(shoppingListEntity);
        actualizedLists.push(shoppingListEntity);
        //console.log('shopping-list.service + actualizedLists', actualizedLists);
      }
    }
    return actualizedLists;
    // await this.shoppingListRepository.update(shoppingListEntity.id, shoppingListEntity);
  }

  async updateAndDeleteListsWithUser(listsAndUserToAdd: AddUserToListDTO) {
    const user: UserEntity = await this.findUserByMail(listsAndUserToAdd.userMail);
    let actualizedLists: ShoppingListEntity[] = [];
    const entityManager = getManager();
    //if (!user) {
    for (let i = 0; i < listsAndUserToAdd.list.length; i++) {
      let shoppingListEntity = await this.shoppingListRepository.findOne(this.findListsById(listsAndUserToAdd.list[i].id));
      if (shoppingListEntity.users.includes(listsAndUserToAdd.userMail)) {
        //console.log('shoppingListEntity.users', shoppingListEntity.users);
        let indexSearchedElem = shoppingListEntity.users.indexOf(listsAndUserToAdd.userMail);
        //console.log('shoppingListEntity.users.indexOf(user.id)', shoppingListEntity.users.indexOf(user.id));
        shoppingListEntity.users.splice(indexSearchedElem, 1);
        //console.log('shoppingListEntity.users..splice(indexSearchedElem,1 ', shoppingListEntity.users.splice(indexSearchedElem, 0));
        await entityManager.save(shoppingListEntity);
        actualizedLists.push(shoppingListEntity);
        //console.log('shopping-list.service + actualizedLists', actualizedLists);
      }
    }
    return actualizedLists;
    /*}
    for (let i = 0; i < listsAndUserToAdd.list.length; i++) {
      let shoppingListEntity = await this.shoppingListRepository.findOne(this.findListsById(listsAndUserToAdd.list[i].id));
      if (shoppingListEntity.users.includes(user.email)) {
        //console.log('shoppingListEntity.users', shoppingListEntity.users);
        let indexSearchedElem = shoppingListEntity.users.indexOf(user.email);
        //console.log('shoppingListEntity.users.indexOf(user.id)', shoppingListEntity.users.indexOf(user.id));
        shoppingListEntity.users.splice(indexSearchedElem, 1);
        //console.log('shoppingListEntity.users..splice(indexSearchedElem,1 ', shoppingListEntity.users.splice(indexSearchedElem, 0));
        await entityManager.save(shoppingListEntity);
        actualizedLists.push(shoppingListEntity);
        //console.log('shopping-list.service + actualizedLists', actualizedLists);
      }
    }
    return actualizedLists;
    // await this.shoppingListRepository.update(shoppingListEntity.id, shoppingListEntity);*/
  }

  async removeDeletedUserFromUsers(userIDDTO: UserIdDTO) {
    const allLists: ShoppingListEntity[] = await this.shoppingListRepository.find();
    const actUser: UserEntity = await this.findUserByID(userIDDTO.id);
    let actualizedLists: ShoppingListEntity[] = [];
    const entityManager = getManager();
    //console.log('shoppingList.service founded User by ID:', actUser);
    let ergListArray: ShoppingListEntity[] = [];
    if (actUser.email) {
      for (let i = 0; i < allLists.length; i++) {
        if (allLists[i].users.includes(actUser.email)) {
          if (allLists[i].users.includes(actUser.email)) {
            //console.log('shoppingListEntity.users', shoppingListEntity.users);
            let indexSearchedElem = allLists[i].users.indexOf(actUser.email);
            //console.log('shoppingListEntity.users.indexOf(user.id)', shoppingListEntity.users.indexOf(user.id));
            allLists[i].users.splice(indexSearchedElem, 1);
            //console.log('shoppingListEntity.users..splice(indexSearchedElem,1 ', shoppingListEntity.users.splice(indexSearchedElem, 0));
            await entityManager.save(allLists[i]);
            actualizedLists.push(allLists[i]);
            //  console.log('shopping-list.service + actualizedLists', actualizedLists);
          }
        }
      }
    }
    return actualizedLists;
  }

  // Helper
  async findUserByMail(mail: string) {
    //console.log('shopping-list.service # findUserByMail', user);
    return await getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.email = :email', { email: mail })
      .getOne();
  }


  async findUserByID(id: string) {
    // console.log('shopping-list.service # findUserByID', user);
    return await getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.id = :id', { id: id })
      .getOne();
  }


  private findListsOfOwner(id: string) {
    return {
      where: {
        creator: id,
      },
    };
  }

  private findListByName(listName: string) {
    return {
      where: { title: listName },
    };
  }

  /*private findUsersOfLists(mail: string) {
    return {
      where: { users: mail },
    };
  }*/

  private findListsById(listId: string) {
    return {
      where: { id: listId },
    };
  }


  /* private findListsOfUser(id: string, allLists: ShoppingListEntity) {
     return {
       /!* for (let x = 0; x < allLists.le)
        where :  allLists[0].users.includes(id)*!/
     };
   }*/


}

/*async updateListsWithUser(addUserToList: AddUserToListDTO) {
    //console.log('shopping-list.updateListsWithUser +addUserToList', addUserToList);
    const user: UserEntity = await this.findUserByMail(addUserToList.userMail);
    console.log('shopping-list.service.updateListsWithUser +user.id', user.id);
    console.log('shopping-list.service.updateListsWithUser +addUserToList.list[0].id', addUserToList.list[0].id);

    const entityManager = getManager();
    const shoppingListEntity: ShoppingListEntity = await this.shoppingListRepository.findOne(this.findListsById(addUserToList.list[0].id));
    console.log('shopping-list.updateListsWithUser +shoppingListEntity.addedUserInList', shoppingListEntity.addedUserInList);
    console.log('shopping-list.updateListsWithUser +shoppingListEntity.users', shoppingListEntity);
    // shoppingListEntity.usersOneToMany.push(user); //
    //const userEntity:UserEntity = await thi


    return await entityManager.save(shoppingListEntity);


    for (let i = 0; i < addUserToList.list.length; i++) {
      console.log('shopping-list.updateListsWithUser (loop)+ item', addUserToList.list[i]);

      //await this.shoppingListRepository.update(addUserToList.list[0].id);
      console.log('shopping-list.updateListsWithUser@loop +list[i]', addUserToList.list);
    }
  }
*/
