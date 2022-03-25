import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './components/footer/footer.component';
import { ListAdminComponent } from './components/list-admin/list-admin.component';
import { DeleteItemDialog, MobileListComponent } from './components/mobile-list/mobile-list.component';
import { LoginComponent } from './components/login/login.component';
import { MatCardModule } from '@angular/material/card';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { UserService } from './services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { NewAccountComponent } from './components/new-account/new-account.component';
import { AppbarComponent } from './components/appbar/appbar.component';
import { MatIconModule } from '@angular/material/icon';
import { GithubSvgComponent } from './components/svg/github-svg/github-svg.component';
import { AccountMenuComponent, DeleteAccountDialog } from './components/appbar/account-menu/account-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { DesktopListComponent } from './components/desktop-list/desktop-list.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { ListService } from './services/lists.services';
import { MessageService } from './services/message.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DescriptionComponent } from './components/description/description.component';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    LoginComponent,
    MainLayoutComponent,
    NewAccountComponent,
    AppbarComponent,
    NewAccountComponent,
    ListAdminComponent,
    MobileListComponent,
    GithubSvgComponent,
    AccountMenuComponent,
    DeleteItemDialog,
    DeleteAccountDialog,
    DesktopListComponent,
    DescriptionComponent,
    // MessageSnack,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    NgScrollbarModule,
    MatRippleModule,
    MatDialogModule,
    MatSelectModule,
    FormsModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatChipsModule,
    MatTabsModule,
  ],
  providers: [UserService, ListService, MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
