import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { LayoutService } from '../../services/layout.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {

  @ViewChild(MatSidenav)
  drawer!: MatSidenav;

  isHandset$: Observable<boolean>;

  constructor(layoutService: LayoutService) {
    this.isHandset$ = layoutService.isHandset$;
  }

  toggleNav(): void {
    void this.drawer.toggle();
  }

}
