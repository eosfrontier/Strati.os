import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminMenuService {

  selectedMenuItem: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor() {
    this.selectedMenuItem.next('missionView');
  }

  public getSelectedMenuItem(): Observable<string> {
    return this.selectedMenuItem.asObservable();
  }

  public setSelectedMenuItem(input: string) {
    this.selectedMenuItem.next(input);
  }
}
