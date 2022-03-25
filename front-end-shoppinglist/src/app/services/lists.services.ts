import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ShoppingList } from '../models/interfaces/shopping-list';
import { User } from '../models/interfaces/user';
import { Observable, ReplaySubject, shareReplay } from 'rxjs';
import { AppConfig } from '../app.config';
import { UserService } from './user.service';
import { ShoppingListItem } from '../models/interfaces/shopping-list-item';
import { AddUserToList } from '../models/interfaces/add-user-to-list';
import { MessageService } from './message.service';
import { BoughtItemByUserDto } from '../models/interfaces/bought-item-by-user.dto';
import { UserId } from '../models/interfaces/user-id';

const apiUrl = AppConfig.BACKEND_URL + 'shopping-list';
const itemApiUrl = AppConfig.BACKEND_URL + 'items';

@Injectable({
  providedIn: 'root',
})

export class ListService {

  private actualList?: ShoppingList;
  private userLists: ShoppingList[];

  // protect changes from outside
  private readonly actualList$: ReplaySubject<ShoppingList>;
  private readonly userLists$: ReplaySubject<ShoppingList[]>;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private messageService: MessageService,
  ) {
    this.userLists = [];
    this.userLists$ = new ReplaySubject<ShoppingList[]>();
    this.actualList$ = new ReplaySubject<ShoppingList>();
  }

  updateActualListWithItem(item: string, group: string) {
    //console.log('ListService updateActualListWithItem: ', group);
    let tempItem: ShoppingListItem = {
      product: item,
      productGroup: group,
      creator: this.userService.getDirectUser().id,
      partOfListWithId: this.actualList!.id!,
      bought_by: undefined,
    };
    //console.log('tmpItem: ', tempItem);
    let observable = this.http.post<ShoppingListItem>(`${itemApiUrl}/createItem`, tempItem).pipe(shareReplay());
    observable.subscribe({
      next: (shoppingItem) => {
        //console.log('ListService next: ', shoppingItem);
        if (shoppingItem) {
          this.actualList!.items.push(shoppingItem);
          this.actualList$.next(this.actualList!);
        } else {
          this.messageService.error('Can´t create a new Item caused by exiting name. ');
        }
      },
      error: (error) => {
        this.messageService.error('Can´t update actual list with item. ' + error.message);
        console.log('listService updateActualListWithItem fail: ', error);
      },
    });
    return observable;
  }

  getItemsOfActualList() {
    let observable = this.http.get<ShoppingListItem[]>(`${itemApiUrl}/${this.actualList?.id}`).pipe(shareReplay());
    observable.subscribe({
      next: (lists) => {
        //console.log('ListService getItemsOfActualList success: ', lists);
      },
      error: (error) => {
        console.log('ListService getItemsOfActualList fail: ', error);
      },
    });
    return observable;
  }

  getDirectActualList() {
    return this.actualList;
  }

  getActualList(): Observable<ShoppingList> {
    return this.actualList$;
  }

  setActualList(shoppingList: ShoppingList) {
    this.getListWithItems(shoppingList.id!).subscribe({
      next: listWithItems => {
        //console.log('ListService next: ', listWithItems);
        this.actualList = listWithItems;
        this.actualList$.next(listWithItems);
      },
    });
  }

  private getListWithItems(listID: string): Observable<ShoppingList> {
    const list$ = this.http.get<ShoppingList>(`${apiUrl}/listWithItems/${listID}`).pipe(shareReplay());
    list$.subscribe({
        error: (error) => {
          console.log('ListService getListWithItems fail', error);
        },
      },
    );
    return list$;
  }

  getListById(id: string): Observable<ShoppingList> {
    //console.log('ListService getListByID + id ', id);
    let shoppingList: ShoppingList = {
      id: id,
      title: this.actualList?.title!,
      items: [],
      creator: this.userService.getDirectUser().id!,
    };
    //console.log('ListService getListByID + Obj: ', shoppingList);
    let observable = this.http.post<ShoppingList>(`${apiUrl}/getOneList`, shoppingList).pipe(shareReplay());
    observable.subscribe({
      next: (list) => {
        //console.log('ListService getListsByID success: ', list);
        this.actualList = list;
        //console.log('ListService getListByID + actualItemList', this.actualItemList);
      },
      error: (error) => {
        console.log('ListService getListsById fail: ', error);
      },
    });
    return observable;
  }

  createList(listName: string): Observable<ShoppingList> {
    let shoppingList: ShoppingList = {
      title: listName,
      items: [],
      users: [],
      creator: this.userService.getDirectUser().id!,
    };
    //console.log('ListService createList +shoppingList: ', shoppingList);
    let observable = this.http.post<ShoppingList>(`${apiUrl}/createList`, shoppingList).pipe(shareReplay());
    observable.subscribe({
      next: (list) => {
        //console.log('ListService createList success: ', list);
        this.userLists.push(list);
        this.userLists$.next(this.userLists);
      },
      error: (error) => {
        this.messageService.error('Can´t create list. ' + error.message);
        console.log('ListService createList fail: ', error);
      },
    });
    return observable;
  }

  getUserLists(): Observable<ShoppingList[]> {
    return this.userLists$;
  }

  getListsOfOwner(user: User): Observable<ShoppingList[]> {
    let observable = this.http.get<ShoppingList[]>(`${apiUrl}/${user.id}`).pipe(shareReplay());
    observable.subscribe({
      next: (lists) => {
        this.userLists = lists;
        this.userLists$.next(lists);
        //console.log('ListService getListsOfOwner success: ', lists);
      },
      error: (error) => {
        console.log('ListService getListsOfOwner fail: ', error);
      },
    });
    return observable;
  }

  getListsOfUser(user: User): Observable<ShoppingList[]> {
    //console.log('ListService getListsOfUser + user', user);
    let observable = this.http.post<ShoppingList[]>(`${apiUrl}/idUser`, user).pipe(shareReplay());
    observable.subscribe({
      next: (lists) => {
        //console.log('ListService getListsOfUser success: ', lists);
      },
      error: (error) => {
        console.log('ListService getListsOfUser fail: ', error);
      },
    });
    return observable;
  }

  deleteList(list: ShoppingList) {
    let userObservable = this.http.delete<ShoppingList>(apiUrl + '/' + list.id).pipe(shareReplay());
    userObservable.subscribe({
      next: (list) => {
        this.userLists = this.userLists.filter(x => x.id !== list.id);
        this.userLists$.next(this.userLists);
      },
      error: (error) => {
        this.messageService.error('Can´t delete list. ' + error.message);
      },
    });
    return userObservable;
  }

  deleteItem(item: ShoppingListItem): Observable<ShoppingListItem> {
    //console.log('ListService deleteItem: ', item);
    let observable = this.http.delete<ShoppingListItem>(itemApiUrl + '/' + item.id).pipe(shareReplay());
    observable.subscribe({
      next: (listItem) => {
        //console.log('ListService deleteItem success: ', listItem);
        this.actualList!.items = this.actualList!.items.filter(item => item.id !== listItem.id);
        // const index = list!.items.findIndex(item => item.id === listItem.id);
        // list!.items.splice(index);
        this.actualList$.next(this.actualList!);
      },
      error: (error) => {
        this.messageService.error('Can´t delete item. ' + error.message);
        console.log('ListService deleteItem fail: ', error);
      },
    });
    return observable;
  }

  setBoughtByUser(item: ShoppingListItem, email?: string) {
    const dto: BoughtItemByUserDto = {
      itemID: item.id!,
      email: email ? email : undefined,
    };
    let observable = this.http.patch<ShoppingListItem>(`${itemApiUrl}/:id`, dto).pipe(shareReplay());
    observable.subscribe({
      next: (shoppingItem) => {
        const index = this.actualList!.items.findIndex(item => item.id === shoppingItem.id);
        this.actualList!.items[index] = shoppingItem;

        //console.log('istService setBoughtByUser success: ', shoppingItem);
      },
      error: (error) => {
        this.messageService.error('Can´t set to bought. ' + error.message);
        console.log('istService setBoughtByUser fail: ', error);
      },
    });
    return observable;
  }

  updateListAddUser(userToAdd: string, selectedLists: ShoppingList[]) {
    let listsAndUserToAdd: AddUserToList = {
      list: selectedLists,
      userMail: userToAdd,
    };
    //console.log('ListService.updateListAddUser + userToAdd', listsAndUserToAdd);
    let observable = this.http.patch<ShoppingList[]>(`${apiUrl}/userId`, listsAndUserToAdd).pipe(shareReplay());
    observable.subscribe({
      next: (lists) => {
        if (!lists) {
          //console.log('Add user fail! Because there is no User with that mail on DataBase');
          this.messageService.info('Add user fail! Because there is no User with that mail on DataBase');
        } else {
          //console.log('ListService updateListAddUser success: ', lists);
          for (const list of lists) {
            const index = this.userLists.findIndex(l => l.id === list.id);
            this.userLists[index] = list;
          }
          this.userLists$.next(this.userLists);
        }
      },
      error: (error) => {
        console.log('ListService updateListAddUser fail: ', error);
        this.messageService.error('Can´t add an user to your list. ' + error.message);
      },
    });
    return observable;
  }

  removeDeletedUserFromAllUsers(userId: string | undefined) {
    let userMailDTO: UserId = {
      id: userId!,
    };
    // console.log('listService.removeDeleted... + userMailDTO', userMailDTO);
    let observable = this.http.patch<ShoppingList[]>(`${apiUrl}/removeDeletedUser`, userMailDTO).pipe(shareReplay());
    observable.subscribe({
      next: (lists) => {
      },
      error: (error) => {
        console.log('ListService removeDeletedUser fail: ', error);
        this.messageService.error('Can´t remove an user from your list. ');
      },
    });
    return observable;

  }

  updateListDeleteUser(userToDelete: string, selectedLists: ShoppingList[]) {
    let listsAndUserToDelete: AddUserToList = {
      list: selectedLists,
      userMail: userToDelete,
    };
    let observable = this.http.patch<ShoppingList[]>(`${apiUrl}/userAndListToDelete`, listsAndUserToDelete).pipe(shareReplay());
    observable.subscribe({
      next: (lists) => {
        if (lists != null) {
          for (const list of lists) {
            const index = this.userLists.findIndex(l => l.id === list.id);
            this.userLists[index] = list;
          }
          this.userLists$.next(this.userLists);
          //console.log('ListService updateListDeleteUser success: ', lists);
        } else {
          console.log('something went wrong, list isn´t iterable');
        }
      },
      error: (error) => {
        console.log('ListService updateListDeleteUser fail: ', error);
        this.messageService.error('Can´t remove an user from your list. ' + error.message);
      },
    });
    return observable;
  }


}

