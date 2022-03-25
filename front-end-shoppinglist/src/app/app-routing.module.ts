import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { NewAccountComponent } from './components/new-account/new-account.component';
import { MobileListComponent } from './components/mobile-list/mobile-list.component';
import { ListAdminComponent } from './components/list-admin/list-admin.component';
import { AuthGuard } from './utils/auth.guard';
import { DesktopListComponent } from './components/desktop-list/desktop-list.component';
import { DescriptionComponent } from './components/description/description.component';
import { LayoutService } from './services/layout.service';

const routes: Routes = [{
  path: '', component: MainLayoutComponent, children: [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'new-account', component: NewAccountComponent },
    { path: 'list-admin', component: ListAdminComponent, canActivate: [AuthGuard] },
    { path: 'shopping-list', component: DesktopListComponent, canActivate: [AuthGuard] },
    { path: 'm-shopping-list', component: MobileListComponent, canActivate: [AuthGuard] },
    { path: 'description', component: DescriptionComponent },
  ],
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {

  constructor(private router: Router,
              private layoutService: LayoutService) {
    this.layoutService.isHandset$.subscribe(isHandset => {
      if (isHandset && router.url == '/shopping-list') {
        void this.router.navigate(['m-shopping-list']);
      } else if (!isHandset && router.url == '/m-shopping-list') {
        void this.router.navigate(['shopping-list']);
      }
    });
  }
}
