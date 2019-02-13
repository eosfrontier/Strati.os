import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authStatus = new BehaviorSubject(false);

  constructor() {
    this.setLoginToFalse();
  }

  private setLoginToFalse(): void {
    this.authStatus.next(false);
  }

  public getAuthStatus(): Observable<boolean> {
    return this.authStatus;
  }
}
