import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, Subject } from 'rxjs';
import { User } from '../models/interfaces/user';
import { LogInData } from '../models/interfaces/log-in-data';
import { AppConfig } from '../app.config';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from './message.service';

const apiUrl = AppConfig.BACKEND_URL + 'user';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  partialUsers?: string[];
  user?: User;
  user$?: Subject<User | null>;


  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              private messageService: MessageService,
              private router: Router) {
    this.user$ = new Subject();
  }

  getDirectUser() {
    return this.user!;
  }

  getUser(): Observable<User | null> {
    return this.user$!;
  }

  login(logInData: LogInData): Observable<User> {
    let userObservable = this.http.post<User>(`${apiUrl}/login`, logInData).pipe(shareReplay());
    userObservable.subscribe({
      next: (res) => {
        if (res === null) {
          this.messageService.info('Login not possible. Please check your login data.');
        } else {
          this.user = res;
          this.user$!.next(res);
          localStorage.setItem('email', logInData.email);
          localStorage.setItem('password', logInData.password);
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          void this.router.navigateByUrl(returnUrl);
        }
      },
      error: (error) => {
        this.messageService.error('LogIn aborted! with: ' + error.message);
      },
    });
    return userObservable;
  }

  logout() {
    this.user = undefined;
    this.user$?.next(null);
    localStorage.setItem('email', '');
    localStorage.setItem('password', '');
    this.messageService.success('Bye! You are logged out');
  }

  createUser(user: User): Observable<User> {
    //console.log('user.service.createUser: ', user);
    let userObservable$ = this.http.post<User>(`${apiUrl}/create`, user).pipe(shareReplay());
    userObservable$.subscribe({
      next: (res) => {
        this.user = res; //
        this.user$!.next(res);
        if (!res) {
          this.messageService.error('Can´t create account. Email is registered');
        }
        //console.log('Create User successful with: ', res);
      },
      error: (error) => {
        this.messageService.error('createUser aborted! with: ' + error.message);
      },
    });
    return userObservable$;
  }

  deleteUser(): Observable<User> {
    // console.log('user.service.delete', this.user!.id);
    let userObservable = this.http.delete<User>(apiUrl + '/' + this.user!.id).pipe(shareReplay());
    userObservable.subscribe({
      next: (res) => {

        this.user$?.next(null);
        this.user = undefined;
        if (res.id != null) {
          this.partialUsers!.push(res.id);

        }
        //console.log('User does not exist: ', res);
      },
      error: (error) => {
        this.messageService.error('Delete User aborted! with: ' + error.message);
      },
    });
    return userObservable;
  }

  /*getAllUser(): Observable<User[]> {
    //console.log('UserService getAllUser: ');
    return this.http.get<User[]>(apiUrl + '/allUser');
  }*/

  // getUserMail(userId: string) {
  //   const userID: UserId = {
  //     id: userId,
  //   };
  //   console.log('user.service.getUserMail', userID);
  //   let result;
  //
  //   let userObservable = this.http.post<User>(`${apiUrl}/getUseresMail`, userID).pipe(shareReplay());
  //   userObservable.subscribe({
  //     next: (res) => {
  //       result = res.email;
  //       console.log('User exist: ', res);
  //     },
  //     error: (error) => {
  //       console.log(error);
  //     },
  //   });
  //   return result;
  // }

}

/*getUserByMail(userToAdd: string) {
  console.log('user.service.getUserByMial + mail:', userToAdd);
  let userObservable = this.http.get<User>(apiUrl + '/' + userToAdd);
  userObservable.subscribe({
    next: (res) => {
      // this.user = undefined;
      if (res == null || undefined) {
        console.log('getUserByMail: ', res);
      } else {
        this.addableUserID = res.id;
        console.log('getUserByMail: ', res);
      }
    },
    error: (error) => {
      console.log(error);
    },
  });
  return userObservable;
}*/


/*updateListAddUser2(userToAdd: string, selectedLists: ShoppingList[]) {
  let listsAndUserToAdd: AddUserToList = {
    list: selectedLists,
    userMail: userToAdd,
  };
  console.log('userService.updateListAddUser2 + userToAdd -> userControler', listsAndUserToAdd);
  let observable = this.http.post<AddUserToList>(`${apiUrl}/updateListWithUser`, listsAndUserToAdd).pipe(shareReplay());
  observable.subscribe({
    next: (lists) => {
      if (!lists) {
        console.log('userService updateListAddUser2 success, but callback is null, coud be no User with that Mial in system...: ');
      }
      console.log('userService updateListAddUser2 success: ', lists);
    },
    error: (error) => {
      console.log('ListService updateListAddUser2 fail: ', error);
    },
  });
}*/


