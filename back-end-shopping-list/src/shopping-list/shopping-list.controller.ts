import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ShoppingListService } from './shopping-list.service';
import { ShoppingListEntity } from './shopping-list.entity';
import { AddUserToListDTO } from '../dto/lists-and-user-to.add-DTO';
import { UserDTO } from '../user/user-DTO';
import { UserIdDTO } from '../dto/user-id-d-t-o';


@Controller('shopping-list')
export class ShoppingListController {


  constructor(private shoppingListService: ShoppingListService,
  ) {
  }


  @Delete(':id')
  delete(@Param('id') id) {
    //console.log('delete @ shoppingList.controller +id : ', id);
    return this.shoppingListService.deleteList(id);
  }

  /* @Delete(':itemId')
   delete(@Param('id') id) {
     console.log('toDelete @ user.controller.ts : ', id);
     return this.shoppingListService.delete(id);
   }*/
  @Post('idUser')
  getListsOfUser(@Body() user: UserDTO): Promise<ShoppingListEntity[]> {
    //console.log('ShoppingListController getListsOfUser ', user.id);
    return this.shoppingListService.getListsOfUser(user.id);
  }

  @Get('listWithItems/:id')
  getListsWithItems(@Param('id') id: string): Promise<ShoppingListEntity> {
    return this.shoppingListService.getListsWithItems(id);
  }

  @Get(':id')
  getListsOfOwner(@Param('id') id: string): Promise<ShoppingListEntity[]> {
    //console.log('ShoppingListController getListsOfOwner ', id);
    return this.shoppingListService.getListsOfOwner(id);
  }

  // @Get('getItem')
  // getListItems() {
  //   return this.shoppingListService.getListItems();
  // }

  @Post('getOneList')
  getListById(@Body() shoppingList: ShoppingListEntity) {
    //console.log('shopping-list.controller + id', shoppingList.id);
    return this.shoppingListService.getListById(shoppingList.id);
  }

  @Post('createList')
  createList(@Body() shoppingList: ShoppingListEntity) {
    //console.log('ShoppingList createList', shoppingList);
    return this.shoppingListService.createList(shoppingList);
  }

  @Patch('removeDeletedUser')
  async removeDeletedUserFromAllUsers(@Body() userIDDTO: UserIdDTO) {
    //console.log("userservice + userIDDTO", userIDDTO);
    return await this.shoppingListService.removeDeletedUserFromUsers(userIDDTO);
  }

  @Patch('userId')
  async update(@Body() listsAndUserToAdd: AddUserToListDTO) {//, @Body() itemDto: ItemDTO) {
    /* console.log('update @@Patch shoppingList.Controller + listsAndUserToAdd', listsAndUserToAdd);
     console.log('update @@Patch shoppingList.Controller + userMail:', listsAndUserToAdd.userMail);*/
    //await this.shoppingListService.addUserToListManyToMany(listsAndUserToAdd);
    return await this.shoppingListService.updateListsWithUserXS(listsAndUserToAdd);

  }

  @Patch('userAndListToDelete')
  async updateDeleteUser(@Body() listsAndUserToAdd: AddUserToListDTO) {//, @Body() itemDto: ItemDTO) {
    //console.log('updateDeleteUser @Patch shoppingList.Controller + listsAndUserToAdd', listsAndUserToAdd);
    //console.log('updateDeleteUser @Patch shoppingList.Controller + userMail:', listsAndUserToAdd.userMail);
    return await this.shoppingListService.updateAndDeleteListsWithUser(listsAndUserToAdd);
    //await this.shoppingListService.updateListsWithUser(listsAndUserToAdd);
    // return this.shoppingListService.update(itemDto.id, itemDto);
  }


  /* @Post('login')
   login(@Body() user: LogInDTO) {
     console.log('ShoppingList login', user);
     return this.shoppingListService.logIn(user);
   }*/
}
