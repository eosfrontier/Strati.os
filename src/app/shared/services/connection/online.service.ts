import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class OnlineService {

  public connectionStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);

  get onlineStatus() {
    return this.connectionStatus.asObservable();
  }

  get isOnline() {
    return !!window.navigator.onLine;
  }

  constructor() {
    this._update();
      window.addEventListener('online', () => this._update());
      window.addEventListener('offline', () => this._update());
  }

  private _update() {
    this.connectionStatus.next(this.isOnline);
  }
}
