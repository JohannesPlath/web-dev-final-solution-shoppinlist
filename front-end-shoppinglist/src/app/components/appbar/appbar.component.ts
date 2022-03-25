import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/interfaces/user';
import { UserService } from '../../services/user.service';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-appbar',
  templateUrl: './appbar.component.html',
  styleUrls: ['./appbar.component.scss'],
})

export class AppbarComponent implements OnInit {

  @Output() toggleNavEvent = new EventEmitter<string>();
  @Output() switchThemeEvent = new EventEmitter<string>();

  actualUser$?: Observable<User | null>;
  isHandset$: Observable<boolean>;

  constructor(
    layoutService: LayoutService,
    private userService: UserService,
  ) {
    this.isHandset$ = layoutService.isHandset$;
  }

  ngOnInit(): void {
    this.actualUser$ = this.userService.getUser();
  }

  emitNavToggle(): void {
    this.toggleNavEvent.emit('toggle');
  }

}
