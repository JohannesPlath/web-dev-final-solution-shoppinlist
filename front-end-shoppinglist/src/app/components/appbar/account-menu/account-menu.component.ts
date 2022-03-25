import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/interfaces/user';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ListService } from '../../../services/lists.services';

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss'],
})
export class AccountMenuComponent implements OnInit {

  user$!: Observable<User | null>;

  constructor(private router: Router,
              private userService: UserService,
              public dialog: MatDialog,
              private listService: ListService) {
  }

  ngOnInit(): void {
    this.user$ = this.userService.getUser();
  }

  logout(): void {
    this.userService.logout();
    void this.router.navigate(['login']);
  }

  deleteAccount(): void {
    this.dialog.open(DeleteAccountDialog, {}).afterClosed().subscribe((res) => {
      if (res === 'delete') {
        this.listService.removeDeletedUserFromAllUsers(this.userService.getDirectUser().id);
        this.userService.deleteUser();
        void this.router.navigate(['new-account']);
      }
    });
  }
}

// mat-dialog

@Component({
  selector: 'delete-item-dialog',
  template: `
    <h1 mat-dialog-title>Delete Account</h1>
    <div mat-dialog-content>
      Do you really want to close your account?
    </div>
    <div mat-dialog-actions>
      <button mat-raised-button mat-dialog-close='0'>Cancel</button>
      <button mat-raised-button mat-dialog-close='delete' class='mat-primary'>Ok</button>
    </div>
  `,
})

export class DeleteAccountDialog {
  constructor() {
  }
}
