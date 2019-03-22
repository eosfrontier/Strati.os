import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Fob } from '../models/fob';
import { environment } from '../../../environments/environment';
import { SupplyBreakpoints } from '../models/supplybreakpoints';

@Injectable({
  providedIn: 'root'
})
export class FobService {

  fobList: BehaviorSubject<Fob[]> = new BehaviorSubject(null);
  selectedFob: BehaviorSubject<Fob> = new BehaviorSubject(null);
  breakpoints: SupplyBreakpoints;
  apiSubscription: Subscription;

  constructor(private http: HttpClient) {
    this.renewApiSubscription();
    this.breakpoints = new SupplyBreakpoints();
  }

  private renewApiSubscription(): void {
    this.apiSubscription = this.getFobsFromAPI().subscribe((fobs) => {
      this.setFobList(fobs);
    });
  }

  public getFobList(): Observable<Fob[]> {
    return this.fobList.asObservable();
  }

  private setFobList(list: Fob[]): void {
    const convertedFobList = this.addCombinedSupplyPercentage(list);
    this.fobList.next(convertedFobList);
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

  private addCombinedSupplyPercentage(list: Fob[]): Fob[] {
    const fobList = [];
    for (const fob of list) {
      fob.combinedPercentage = ((fob.foodSupplyPercentage + fob.medicalSupplyPercentage + fob.weaponSupplyPercentage) / 3);
      fobList.push(fob);
    }
    return fobList;
  }

  public updateFob(fob: Fob): void {
    this.http.post(environment.FOB.API_URL + 'update', fob).subscribe(
      data => {
        console.log(data);
      }
    );
  }

  public socketUpdateTrigger(): void {
    console.log('socketupdatetrigger');
    this.renewApiSubscription();
  }

  private getFobsFromAPI(): Observable<any> {
    return this.http.get(environment.FOB.API_URL).pipe(
      map(res => {
        return res;
      })
    );
  }
}
