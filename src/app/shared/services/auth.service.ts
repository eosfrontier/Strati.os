import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authStatus = new BehaviorSubject(false);
  private readonly passcode = 34471; // yes, right here in the code. It doesn't need to be secure.

  constructor() {
    this.setLoginToFalse();
  }

  private setLoginToFalse(): void {
    this.authStatus.next(false);
  }

  public getAuthStatus(): Observable<boolean> {
    return this.authStatus;
  }

  public setAuthStatus(passcode: number): boolean {
    this.authStatus.next(passcode === this.passcode);
    return (passcode === this.passcode);
  }
}
