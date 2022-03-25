import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogInDTO } from './logInDTO';
import { UserDTO } from './user-DTO';
import { UserIdDTO } from '../dto/user-id-d-t-o';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne(this.findUserByMail(user.email));
    if (existingUser) {
      //console.log('UserService can´t create user. user exist: ', existingUser);
      return new Promise(function(resolve) {
        if (existingUser) {
          resolve(null);
        }
      });
    } else {
      //console.log('UserService create new user: ', user);
      return await this.userRepository.save(user);
    }
  }

  async logIn(data: LogInDTO): Promise<UserEntity | undefined> {
    //console.log(data);
    const userEntity = await this.userRepository.findOne({
      where: {
        email: data.email,
      },
      relations: ['lists'],
    });
    if (!userEntity) {
      //console.log('UserService can´t create user. user exist: ', userEntity);
      return new Promise(function(resolve) {
        if (!userEntity) {
          resolve(null);
        }
      });
    } else {
      //console.log('UserService logIn: ', userEntity);
      return userEntity;
    }
  }

  async delete(uuid: string) {
    //console.log('UserService# Delete', uuid);
    //const actualUser = this.findUserByMail(email)
    return await this.userRepository.delete(uuid);
  }

  async getUserIdByMail(mail: string): Promise<UserDTO> {
// console.log('UserService# getUserByMail', mail);
    const foundUser: UserEntity = await this.userRepository.findOne(this.findUserByMail(mail));
    if (!foundUser) {
      // console.log('UserService cant find user. user dos not exist: ');
      return new Promise(function(resolve) {
        resolve(null);
      });
    } else {
      // console.log('UserService# getUserByMail.foundUser', foundUser);
      // console.log('UserService# getUserByMail.emptyUserWithID', emptyUserWithID);
      return {
        id: foundUser.id,
      };
    }
  }

  async getAllUser(): Promise<UserEntity[]> {
    return await this.userRepository
      .createQueryBuilder('all_user')
      .getMany();
  }

  async getUsersMailByID(id: UserIdDTO) {
    const foundedUser = await this.userRepository.findOne(this.findUserMailByID(id.id));
    //console.log('UserService# getUsersMailByID', foundedUser);
    if (!foundedUser) {
      // console.log('UserService cant find user. user dos not exist: ');
      return new Promise(function(resolve) {
        resolve(null);
      });
    } else {
      // console.log('UserService# getUserByMail.foundUser', foundUser);
      const emptyUserWithMail: UserDTO = {
        email: foundedUser.email,
      };
      // console.log('UserService# getUserByMail.emptyUserWithID', emptyUserWithID);
      return emptyUserWithMail;
    }
  }


  // Helper
  /* findUserByData(data: LogInDTO) {
     return {
       where:
         {
           email: data.email, password: data.password,
         },
     };
   }*/

  private findUserMailByID(id: string) {
    return {
      where: {
        id: id,
      },
    };
  }

  private findUserByMail(mail: string) {
    return {
      where:
        {
          email: mail,
        },
    };
  }
}

/* private async findListByDTO(shoppingListDTO: ShoppingListDTO) {
   //console.log('user.service findUserByDTO + shoppingListDTO.id', shoppingListDTO.id);
   const list = await getRepository(ShoppingListEntity)
     .createQueryBuilder('shoppingList')
     .where('shoppingList.id =:id', { id: shoppingListDTO.id })
     .getOne();
   console.log('userContr.FindListByDTO + list', list);
   return list;
 }*/


/*async updateListWithUserService(listsAndUserToAdd: AddUserToListDTO) {
   // console.log('user.Service.updateListsWithUser +addUserToList', listsAndUserToAdd);
   const actUser: UserEntity = await this.userRepository.findOne(this.findUserByMail(listsAndUserToAdd.userMail));
   if (!actUser) {
     // console.log('UserService can´t find user. user dos not exist: ');
     return new Promise(function(resolve) {
       resolve(null);
     });
   } else {

     const listEntityManager = getManager();
     const listEntity = await this.findListByDTO(listsAndUserToAdd.list[0]);
     const listEntity2 = await this.findListByDTO(listsAndUserToAdd.list[1]);
     console.log('    console.log("")actUser.areAddedToList\n', actUser.areAddedToList);
     //console.log('user.Service.updateListsWithUser listEntity', listEntity);
     console.log('user.Service.updateListsWithUser actUser', actUser);

     let listRepo = listEntity;
     let listRepo2 = listEntity2;
     if (actUser.areAddedToList == undefined) {
       //actUser.areAddedToList = [listRepo];
       actUser.areAddedToList = [listEntity2].concat(listRepo);
       console.log('user.Service.updateListsWithUser actUser.areAddedToList = [listRepo] as actUser', actUser);
       return await listEntityManager.save(actUser);
     } else {
       let tempAreAdded = actUser.areAddedToList = [listRepo, listRepo2];
       console.log('user.Service.updateListsWithUser actUser.areAddedToList', actUser.areAddedToList);
       console.log('user.Service.updateListsWithUser tempAreAdded', tempAreAdded);

       tempAreAdded = [listRepo, listRepo2];
       console.log('user.Service.updateListsWithUser actUser neu', actUser);
     }

     /!* let userRepo = getRepository(UserEntity);
      userRepo.save(actUser)
        .then(actUer => console.log('actUser', actUser))
        .catch(error => console.log(error));
  *!/

     return await listEntityManager.save(actUser);
   }
 }*/
