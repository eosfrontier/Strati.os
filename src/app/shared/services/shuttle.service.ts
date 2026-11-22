import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Shuttle } from '../models/shuttle';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ShuttleService {

  apiSubscription: Subscription;
  shuttleList: BehaviorSubject<Shuttle[]> = new BehaviorSubject([]);
  selectedShuttle: BehaviorSubject<Shuttle> = new BehaviorSubject(null);

  constructor(private http: HttpClient) {
    this.renewApiSubscription();
  }

  public getShuttleList(): Observable<Shuttle[]> {
    return this.shuttleList.asObservable();
  }

  public selectShuttle(selected: Shuttle): void {
    this.selectedShuttle.next(selected);
  }

  public unselectShuttle(): void {
    this.selectedShuttle.next(null);
  }

  public getSelectedShuttle(): Observable<Shuttle> {
    return this.selectedShuttle.asObservable();
  }

  public refreshShuttles(): void {
    this.renewApiSubscription();
  }

  public convertFormDataToShuttle(formData: any, existing?: Shuttle): Shuttle {
    const shuttle = new Shuttle();
    const id = formData.id || (existing ? existing.id : undefined);
    if (id) {
      shuttle.id = String(id);
    }
    shuttle.name = (formData.name || '').trim();
    shuttle.serial_number = (formData.serial_number || '').trim();
    shuttle.class = (formData.class || '').trim();
    shuttle.type = (formData.type || '').trim();
    shuttle.capacity = formData.capacity !== null && formData.capacity !== undefined && formData.capacity !== ''
      ? String(formData.capacity)
      : '';
    shuttle.base = (formData.base || '').trim();
    shuttle.state = (formData.state || '').trim();
    shuttle.status_name = (formData.status_name || '').trim();
    shuttle.status = this.resolveStatusCode(shuttle.status_name, existing ? existing.status : undefined);
    shuttle.operable = formData.operable ? '1' : '0';
    shuttle.required_skill = (formData.required_skill || '').trim();

    if (existing) {
      shuttle.class_id = existing.class_id;
      shuttle.assigned_to_name = existing.assigned_to_name;
      shuttle.assigned_to_id = existing.assigned_to_id;
      shuttle.required_skill_id = existing.required_skill_id;
    }

    return shuttle;
  }

  public createNewShuttle(shuttle: Shuttle): void {
    this.http.post(environment.SHUTTLE.API_URL, shuttle).subscribe(
      () => {
        this.renewApiSubscription();
      },
      err => {
        console.error('Failed to create shuttle', err);
      }
    );
  }

  public updateShuttle(shuttle: Shuttle): void {
    if (!shuttle || !shuttle.id) {
      return;
    }
    this.http.put(`${environment.SHUTTLE.API_URL}${encodeURIComponent(shuttle.id)}`, shuttle).subscribe(
      () => {
        this.renewApiSubscription();
      },
      err => {
        console.error('Failed to update shuttle', err);
      }
    );
  }

  public deleteShuttle(shuttle: Shuttle): void {
    if (!shuttle || !shuttle.id) {
      return;
    }
    this.http.delete(`${environment.SHUTTLE.API_URL}${encodeURIComponent(shuttle.id)}`).subscribe(
      () => {
        const selected = this.selectedShuttle.getValue();
        if (selected && selected.id === shuttle.id) {
          this.unselectShuttle();
        }
        this.renewApiSubscription();
      },
      err => {
        console.error('Failed to delete shuttle', err);
      }
    );
  }

  private resolveStatusCode(statusName: string, fallback?: string): string {
    const normalized = (statusName || '').trim().toLowerCase();
    if (normalized === 'ready') {
      return '0';
    }
    if (normalized === 'on mission') {
      return '2';
    }
    return fallback !== undefined && fallback !== null ? String(fallback) : '0';
  }

  private setShuttleList(list: any = []): void {
    const _shuttles: Shuttle[] = [];

    if (list) {
      let parsedList: any;
      if (typeof list === 'string') {
        try {
          parsedList = JSON.parse(list);
        } catch (err) {
          console.error('Failed to parse shuttle list', err);
          return;
        }
      } else {
        parsedList = list;
      }

      if (Array.isArray(parsedList)) {
        parsedList.forEach((shuttle) => {
          const _shuttle = new Shuttle();
          _shuttle.id = shuttle.id;
          _shuttle.name = shuttle.name;
          _shuttle.serial_number = shuttle.serial_number;
          _shuttle.class = shuttle.class;
          _shuttle.class_id = shuttle.class_id;
          _shuttle.type = shuttle.type;
          _shuttle.capacity = shuttle.capacity;
          _shuttle.base = shuttle.base;
          _shuttle.state = shuttle.state;
          _shuttle.operable = shuttle.operable;
          _shuttle.status_name = shuttle.status_name;
          _shuttle.status = shuttle.status;
          _shuttle.assigned_to_name = shuttle.assigned_to_name;
          _shuttle.assigned_to_id = shuttle.assigned_to_id;
          _shuttle.required_skill = shuttle.required_skill;
          _shuttle.required_skill_id = shuttle.required_skill_id;
          _shuttles.push(_shuttle);
        });
      }
    }

    this.shuttleList.next(_shuttles);
    this.updateShuttleIfSelected(_shuttles);
  }

  private updateShuttleIfSelected(shuttles: Shuttle[]): void {
    const current = this.selectedShuttle.getValue();
    if (current) {
      const updated = shuttles.find(s => s.id === current.id);
      if (updated) {
        this.selectShuttle(updated);
      }
    }
  }

  private getShuttlesFromAPI(): any {
    const httpOptions: object = {
      headers: new HttpHeaders({
        'getAll': 'true'
      }),
      responseType: 'text'
    };

    return this.http.get(environment.SHUTTLE.API_URL, httpOptions).pipe(map(res => res));
  }

  private renewApiSubscription(): void {
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }
    this.apiSubscription = this.getShuttlesFromAPI().subscribe(
      (shuttles) => {
        this.setShuttleList(shuttles);
      },
      (err) => {
        console.error('Failed to load shuttles', err);
      }
    );
  }
}
