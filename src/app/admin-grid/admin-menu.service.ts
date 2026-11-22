import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminMenuService {

  selectedMenuItem: BehaviorSubject<string> = new BehaviorSubject(null);
  authenticated: boolean;
  private readonly defaultScreen = 'missionView';
  private pendingMenuItem: string;

  constructor(private auth: AuthService) {
    this.authenticated = false;
    this.selectedMenuItem.next(this.defaultScreen);
    this.auth.getAuthStatus().subscribe(authenticated =>
      this.authenticated = authenticated
    );
  }

  public getSelectedMenuItem(): Observable<string> {
    return this.selectedMenuItem.asObservable();
  }

  public setSelectedMenuItem(input: string) {
    if (!this.authenticated) {
      if (
          input === 'fobAdd'      ||
          input === 'fobEdit'     ||
          input === 'fobView'     ||
          input === 'shuttleAdd'  ||
          input === 'shuttleEdit' ||
          input === 'shuttleView'
      ) {
        this.pendingMenuItem = input;
        input = 'authFirst';
      }
    }
    this.selectedMenuItem.next(input);
  }

  public getPostLoginMenuItem(): string {
    const target = this.pendingMenuItem || 'fobView';
    this.pendingMenuItem = null;
    return target;
  }

  logout(): void {
    this.pendingMenuItem = null;
    this.auth.setAuthStatus(null);
    this.selectedMenuItem.next(this.defaultScreen);
  }


}
