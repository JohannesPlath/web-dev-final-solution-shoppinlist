import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  constructor(private snackBar: MatSnackBar) {
  }

  success(message: string): void {
    this.snackBar.open(message, undefined, { panelClass: ['snackbar-success'], duration: 2000 });
  }

  error(message: string): void {
    this.snackBar.open(message, 'close', { panelClass: ['snackbar-error'] });
  }

  info(message: string): void {
    this.snackBar.open(message, 'close', { panelClass: ['snackbar-info'] });
  }
}
