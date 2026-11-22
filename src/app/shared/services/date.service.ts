import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IcDate } from '../models/icdate';

export interface ParsedIcDate {
  day: number;
  month: number;
  year: number;
  yearAfter: string;
}

@Injectable({
  providedIn: 'root'
})
export class DateService {

  private static readonly IC_DATE_PATTERN = /^\s*(\d{1,2})\.(\d{1,2})\.(\d+)([A-Za-z]*)\s*$/;

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

  public getCurrentIcDateString(): string {
    return this.formatIcDate(this.icDate.getValue());
  }

  /**
   * @description formats an IcDate object as DD.MM.<year><yearAfter> (e.g. 18.05.240NT).
   */
  public formatIcDate(date: IcDate): string {
    if (!date || date.day == null || date.month == null || date.year == null) {
      return '';
    }
    const day = Number(date.day);
    const month = Number(date.month);
    const year = Number(date.year);
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return '';
    }
    const yearAfter = date.yearAfter ? date.yearAfter.trim().toUpperCase() : '';
    return `${this.padTwoDigits(day)}.${this.padTwoDigits(month)}.${year}${yearAfter}`;
  }

  /**
   * @description parses an IC date string in DD.MM.<year><yearAfter> format.
   */
  public parseIcDate(value: string): ParsedIcDate | null {
    if (typeof value !== 'string') {
      return null;
    }
    const match = DateService.IC_DATE_PATTERN.exec(value);
    if (!match) {
      return null;
    }
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    const yearAfter = match[4] ? match[4].toUpperCase() : '';
    if (day < 1 || day > 31 || month < 1 || month > 12) {
      return null;
    }
    return { day, month, year, yearAfter };
  }

  /**
   * @description normalizes a valid IC date string to zero-padded DD.MM.<year><yearAfter>.
   */
  public normalizeIcDate(value: string): string {
    const parsed = this.parseIcDate(value);
    if (!parsed) {
      return typeof value === 'string' ? value.trim() : '';
    }
    return `${this.padTwoDigits(parsed.day)}.${this.padTwoDigits(parsed.month)}.${parsed.year}${parsed.yearAfter}`;
  }

  /**
   * @description returns a numeric sort key in YYYYMMDD order, or Infinity for missing/invalid values.
   */
  public getIcDateSortKey(value: string): number {
    const parsed = this.parseIcDate(value);
    if (!parsed) {
      return Infinity;
    }
    return parsed.year * 10000 + parsed.month * 100 + parsed.day;
  }

  public icDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null || control.value === '') {
        return null;
      }
      return this.parseIcDate(control.value) ? null : { invalidIcDate: true };
    };
  }

  private padTwoDigits(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
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
