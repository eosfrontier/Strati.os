import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Fob } from '../models/fob';
import { environment } from '../../../environments/environment';
import { SocketService } from './socket.service';
import { SupplyBreakpoints } from '../models/supplybreakpoints';

@Injectable({
  providedIn: 'root'
})
export class FobService {

  fobList: BehaviorSubject<Fob[]> = new BehaviorSubject(null);
  selectedFob: BehaviorSubject<Fob> = new BehaviorSubject(null);
  breakpoints: SupplyBreakpoints;

  constructor(private http: HttpClient, private socketService: SocketService) {
    this.getFobsFromAPI().subscribe((fobs) => {
      this.setFobList(fobs);
    });
    this.breakpoints = new SupplyBreakpoints();
  }

  public getFobList(): Observable<Fob[]> {
    return this.fobList.asObservable();
  }

  private setFobList(list: Fob[]): void {
    this.fobList.next(list);
  }

  public selectFob(selected: Fob) {
    this.selectedFob.next(selected);
  }

  /**
   * @description clear the 'selectedFob' variable to, for example, close the popup dialog.
   */
  public unselectFob(): void {
    this.selectedFob.next(null);
  }

  public getSelectedFob(): Observable<Fob> {
    return this.selectedFob.asObservable();
  }

  private getFobsFromAPI(): Observable<any> {
    return this.http.get(environment.FOB.API_URL).pipe(
      map(res => {
        return res;
      })
    );
  }
}
