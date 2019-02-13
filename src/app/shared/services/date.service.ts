import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IcDate } from '../models/icdate';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  public icDate: BehaviorSubject<IcDate> = new BehaviorSubject(null);

  constructor(private http: HttpClient) {
    this.getDateFromAPI().subscribe((date) => {
      this.setInGameDate(
        this.convertToInGameDate(date)
      );
    });
  }

  public getIcDate(): Observable<IcDate> {
    return this.icDate.asObservable();
  }

  private getDateFromAPI(): Observable<any> {
    return this.http.get(environment.DATETIME.API_URL).pipe(map(res => {
      return res;
    }));
  }

  /**
   * @description converts the JSON from the API into a valid IcDate object
   */
  private convertToInGameDate(dateJson): IcDate {
    const convertedDate = new IcDate();
      convertedDate.day = dateJson.iDay;
      convertedDate.dayName = this.shortenDayName(dateJson.iDayName);
      convertedDate.month = dateJson.iMonth;
      convertedDate.monthName = dateJson.iMonthName;
      convertedDate.year = dateJson.iYear;
      convertedDate.yearAfter = dateJson.iYearAfter;
    return convertedDate;
  }

  private setInGameDate(date: IcDate): void {
    this.icDate.next(date);
  }

  /**
   * @description turns 'monday' into 'mon', 'tuesday' into 'tue', etc.
   */
  public shortenDayName(dayname: string): string {
    return dayname.substr(0, 3);
  }
}
