import { Component, OnInit } from '@angular/core';
import { ShoppingList } from '../../models/interfaces/shopping-list';
import { ListService } from '../../services/lists.services';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-list-management',
  templateUrl: './list-admin.component.html',
  styleUrls: ['./list-admin.component.scss'],
})
export class ListAdminComponent implements OnInit {

  selectedLists: ShoppingList[] = [];
  shoppingLists$?: Observable<ShoppingList[]>;
  userToRemove?: string;
  usersOfSelectedList?: string[];
  allUserToDelete$: Subject<string[]>;
  addNewList = false;
  addNewUser = false;
  addNewUserWithoutList = false;

  addListForm = this.fb.group({
    addNewList: [null, Validators.required],
  });

  changeForm = this.fb.group({
    addUser: [null, Validators.required],
  });

  constructor(private fb: FormBuilder,
              private shoppingListService: ListService,
              private userService: UserService,
              private router: Router,
              private messageService: MessageService,
  ) {
    this.allUserToDelete$ = new Subject<string[]>();
  }

  ngOnInit(): void {
    // leider nötig, ohne weitere anpassungen
    this.shoppingListService.getListsOfOwner(this.userService.getDirectUser());
    this.shoppingLists$ = this.shoppingListService.getUserLists();
  }

  openAndNavigate() {
    // console.log('list.title: ', this.selectedLists[0].title);
    this.shoppingListService.setActualList(this.selectedLists[0]);
    void this.router.navigate(['shopping-list/']);
  }

  addUser() {
    if (this.selectedLists.length == 0) {
      this.addNewUserWithoutList = true;
      this.messageService.info('no list selected, choose one!!');
    } else {
      let userToAdd = this.changeForm.controls['addUser'].value;
      if (userToAdd == this.userService.getDirectUser().email) {
        console.log('your the owner, you need no user status !!');
        this.messageService.info('your the owner, you need no user status !!');
        return;
      }
      this.shoppingListService.updateListAddUser(userToAdd, this.selectedLists).subscribe({
        next: (list) => {
          if (list == null) {
            this.addNewUser = true;
          }
        },
        error: (error) => {
          console.log('listAdmin addUser fail: ', error);
        },
      });
    }
  }

  onSelectUserList($event: MatSelectChange) {
    // console.log('onSelectUserList $event.value');
    this.userToRemove = $event.value;
    //console.log('onSelectUserList $event.value', $event.value);
  }

  onSubmit() {
    if (this.addListForm.invalid) {
      return;
    }
    let listName = this.addListForm.controls['addNewList'].value;
    this.shoppingListService.createList(listName).subscribe({
      next: (res) => {
        this.addNewList = !res;
        this.shoppingListService.setActualList(res);
      },
    });
  }

  onSelection(e: any, value: any) {
    this.selectedLists = [];
    this.usersOfSelectedList = [];
    //console.log('Selection list');
    for (let a of value) {
      /*console.log('a.value', a.value);
      console.log('a.value.users', a.value.users);*/
      this.selectedLists.push(a.value);
      for (let i = 0; i < a.value.users.length; i++) {
        //  console.log('selectedLists', this.selectedLists[0].users);
        if (!this.usersOfSelectedList.includes(a.value.users[i])) {
          //console.log('einen gefunden');
          this.usersOfSelectedList?.push(a.value.users[i]);
        }
      }
    }

    // this.allUserToDelete$.subscribe({
    //   next: urser => console.log('fff', urser),
    // });
    this.allUserToDelete$.next(this.usersOfSelectedList);
    //console.log('usersOfSelectedList', this.usersOfSelectedList);
  }

  onDelete() {
    //console.log('list-admin.component + ergList ', this.selectedLists);
    for (let x of this.selectedLists) {
      this.shoppingListService.deleteList(x);
    }
  }

  deleteUserFromList() {
    if (this.selectedLists.length == 0) {
      this.addNewUserWithoutList = true;
    } else {
      let userToDelete = this.userToRemove!;
      //console.log('userToDelete', userToDelete);
      this.shoppingListService.updateListDeleteUser(userToDelete, this.selectedLists);
    }
  }

}
