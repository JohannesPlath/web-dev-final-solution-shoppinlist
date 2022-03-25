import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private readonly userService: UserService,
    private readonly route: ActivatedRoute,
    private readonly matIconRegistry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer,
  ) {
    this.matIconRegistry.addSvgIcon('github', this.sanitizer.bypassSecurityTrustResourceUrl('../assets/github.svg'));
  }

  ngOnInit(): void {
    this.enableLoginByLocalStorage();
    this.enableLoginByUrlParams();
  }

  enableLoginByUrlParams() {
    this.route.queryParams.subscribe(params => {
      let email = params['email'];
      let password = params['password'];
      if (email !== undefined && password !== undefined) {
        this.userService.login({
          email: email,
          password: password,
        });
      }
    });
  }

  enableLoginByLocalStorage() {
    let email = localStorage.getItem('email');
    let password = localStorage.getItem('password');
    if (email && password) {
      this.userService.login({
        email: email,
        password: password,
      });
    }
  }
}
