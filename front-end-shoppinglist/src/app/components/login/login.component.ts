import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  loginFail = false;

  loginForm = this.fb.group({
    eMail: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required],
  });

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private router: Router,
  ) {
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    let email = this.loginForm.controls['eMail'].value;
    let password = this.loginForm.controls['password'].value;

    let loginData = {
      email: email,
      password: password,
    };

    this.userService.login(loginData).subscribe({
      next: (res) => {
        this.loginFail = !res;
        if (res) {
          void this.router.navigate(['list-admin']);
        }
      },
    });
  }

}
