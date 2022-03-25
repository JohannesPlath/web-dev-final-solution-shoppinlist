import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/interfaces/user';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.scss'],
})

export class NewAccountComponent {

  newAccountForm = this.fb.group({
    firstName: [null, Validators.required],
    famName: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required],
    confPassword: [null, Validators.required],
  });

  securityLevel = 0;

  form = this.newAccountForm.controls;

  constructor(private fb: FormBuilder,
              private router: Router,
              private userService: UserService) {
  }

  onSubmit(): void {
    if (this.newAccountForm.invalid) {
      //console.log('invalid');
      return;
    }
    const firstName = this.form['firstName'].value;
    const famName = this.form['famName'].value;
    const email = this.form['email'].value;
    const password = this.form['password'].value;

    const userToSubmit: User = {
      famName: famName,
      givenName: firstName,
      email: email,
      password: password,
    };
    let user$ = this.userService.createUser(userToSubmit);
    user$.subscribe({
      next: (res) => {
        // this.user = res; //
        //console.log(res);
        void this.router.navigate(['list-admin']);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  colorCheck() {
    this.securityLevel = 0;
    let passWordL = this.newAccountForm.controls['password'].value;
    let confPassword = this.newAccountForm.controls['confPassword'].value;

    let mustHaveSpecialSign = /[! @'$%^&*]/;
    let mustHaveUpCase = /[A-Z]/;
    let mustHaveLowCase = /[a-z]/;
    let mustHaveNumber = /[0-9]/;

    let countOfSpecialSign = passWordL.search(mustHaveSpecialSign);
    let countOfUpperCase = passWordL.search(mustHaveUpCase);
    let countOfLowerCase = passWordL.search(mustHaveLowCase);
    let countOfNumber = passWordL.search(mustHaveNumber);

    if ((countOfSpecialSign > 0)) {
      this.securityLevel++;
    }
    if ((countOfLowerCase >= 0)) {
      this.securityLevel++;
    }
    if ((countOfUpperCase >= 0)) {
      this.securityLevel++;
    }
    if ((countOfNumber >= 0)) {
      this.securityLevel++;
    }
    if ((passWordL.length >= 8)) {
      this.securityLevel++;
    }
    if (passWordL == confPassword) {
      this.securityLevel++;
    }

  }

  isValid(): boolean {
    // console.log('isValid + seclevel', this.securityLevel);
    return this.securityLevel >= 5 &&
      this.newAccountForm.controls['confPassword'].value == this.newAccountForm.controls['password'].value;
  }

  getWarnColor(): string {
    switch (this.securityLevel) {
      case 1:
        return 'red';
      case 2:
        return 'lightcoral';
      case 3:
        return 'orange';
      case 4:
        return 'yellow';
      case 5:
        return 'green';
    }
    return 'unset';
  }
}
