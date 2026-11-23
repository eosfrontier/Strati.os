import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, Subscription, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Shuttle, ShuttleClass } from '../models/shuttle';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ShuttleService {

  apiSubscription: Subscription;
  shuttleList: BehaviorSubject<Shuttle[]> = new BehaviorSubject([]);
  selectedShuttle: BehaviorSubject<Shuttle> = new BehaviorSubject(null);
  shuttleError: BehaviorSubject<string> = new BehaviorSubject(null);
  private skillNameCache: Map<string, string> = new Map();

  constructor(private http: HttpClient) {
    this.renewApiSubscription();
  }

  public getShuttleList(): Observable<Shuttle[]> {
    return this.shuttleList.asObservable();
  }

  public getShuttleError(): Observable<string> {
    return this.shuttleError.asObservable();
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

  public getShuttleClasses(): Observable<ShuttleClass[]> {
    return this.http.get<ShuttleClass[]>(environment.SHUTTLE.API_URL, {
      headers: this.authHeaders({ getClasses: 'true' })
    }).pipe(
      map(res => {
        const parsed = typeof res === 'string' ? this.safeJsonParse(res) : res;
        return Array.isArray(parsed) ? parsed : [];
      })
    );
  }

  public extractSkillIds(shuttleClass: ShuttleClass): string[] {
    if (!shuttleClass) {
      return [];
    }
    const fromId = this.parseNumericIdList(shuttleClass.required_skill_id);
    const fromSkill = this.parseNumericIdList(shuttleClass.required_skill);
    if (fromId.length === 0) {
      return fromSkill;
    }
    if (fromSkill.length === 0) {
      return fromId;
    }
    return Array.from(new Set([...fromId, ...fromSkill]));
  }

  public getSkillNameById(skillId: number | string): Observable<string | null> {
    const id = skillId !== null && skillId !== undefined ? String(skillId).trim() : '';
    if (!id) {
      return of(null);
    }
    if (this.skillNameCache.has(id)) {
      return of(this.skillNameCache.get(id));
    }
    return this.http.get<any>(environment.SKILL.API_URL, {
      headers: this.authHeaders({ skill_id: id }, environment.SKILL.TOKEN)
    }).pipe(
      map(res => {
        const parsed = typeof res === 'string' ? this.safeJsonParse(res) : res;
        const record = Array.isArray(parsed) ? parsed[0] : parsed;
        const name = record && record.name ? String(record.name).trim() : null;
        if (name) {
          this.skillNameCache.set(id, name);
        }
        return name;
      })
    );
  }

  public getSkillNamesForClass(shuttleClass: ShuttleClass): Observable<string[]> {
    const ids = this.extractSkillIds(shuttleClass);
    if (ids.length === 0) {
      return of([]);
    }
    return forkJoin(
      ids.map(id => this.getSkillNameById(id).pipe(catchError(() => of(null))))
    ).pipe(
      map(names => names.filter((name): name is string => Boolean(name)))
    );
  }

  public convertFormDataToShuttle(
    formData: any,
    existing?: Shuttle,
    selectedClass?: ShuttleClass,
    resolvedRequiredSkill?: string
  ): Shuttle {
    const shuttle = new Shuttle();
    const id = formData.id || (existing ? existing.id : undefined);
    if (id) {
      shuttle.id = String(id);
    }
    shuttle.name = (formData.name || '').trim();
    shuttle.serial_number = (formData.serial_number || '').trim();
    shuttle.class = selectedClass ? selectedClass.name : (formData.class || '').trim();
    shuttle.base = (formData.base || '').trim();
    shuttle.state = (formData.state || '').trim();
    shuttle.status_name = (formData.status_name || '').trim();
    shuttle.status = this.resolveStatusCode(shuttle.status_name, existing ? existing.status : undefined);
    shuttle.operable = formData.operable ? '1' : '0';

    if (selectedClass) {
      shuttle.class_id = selectedClass.id !== null && selectedClass.id !== undefined ? String(selectedClass.id) : undefined;
      shuttle.type = selectedClass.type || '';
      shuttle.capacity = selectedClass.capacity !== null && selectedClass.capacity !== undefined
        ? String(selectedClass.capacity)
        : '';
      shuttle.armor = selectedClass.armor !== undefined ? selectedClass.armor : null;
      shuttle.required_skill = resolvedRequiredSkill || selectedClass.required_skill || '';
      if (selectedClass.required_skill_id !== null && selectedClass.required_skill_id !== undefined) {
        shuttle.required_skill_id = String(selectedClass.required_skill_id);
      }
    } else if (existing) {
      shuttle.class_id = existing.class_id;
      shuttle.type = existing.type;
      shuttle.capacity = existing.capacity;
      shuttle.armor = existing.armor;
      shuttle.required_skill = existing.required_skill;
      shuttle.required_skill_id = existing.required_skill_id;
    }

    if (existing) {
      shuttle.assigned_to_name = existing.assigned_to_name;
      shuttle.assigned_to_id = existing.assigned_to_id;
    }

    return shuttle;
  }

  public createNewShuttle(shuttle: Shuttle): void {
    this.http.post(environment.SHUTTLE.API_URL, shuttle, {
      headers: this.authHeaders({ 'Content-Type': 'application/json' })
    }).subscribe(
      () => {
        this.shuttleError.next(null);
        this.renewApiSubscription();
      },
      err => {
        console.error('Failed to create shuttle', err);
        this.shuttleError.next(this.formatHttpError(err, 'create shuttle'));
      }
    );
  }

  public updateShuttle(shuttle: Shuttle): void {
    if (!shuttle || !shuttle.id) {
      return;
    }
    this.http.put(
      `${environment.SHUTTLE.API_URL}${encodeURIComponent(shuttle.id)}`,
      shuttle,
      { headers: this.authHeaders({ 'Content-Type': 'application/json' }) }
    ).subscribe(
      () => {
        this.shuttleError.next(null);
        this.renewApiSubscription();
      },
      err => {
        console.error('Failed to update shuttle', err);
        this.shuttleError.next(this.formatHttpError(err, 'update shuttle'));
      }
    );
  }

  public deleteShuttle(shuttle: Shuttle): void {
    if (!shuttle || !shuttle.id) {
      return;
    }
    this.http.delete(
      `${environment.SHUTTLE.API_URL}${encodeURIComponent(shuttle.id)}`,
      { headers: this.authHeaders() }
    ).subscribe(
      () => {
        const selected = this.selectedShuttle.getValue();
        if (selected && selected.id === shuttle.id) {
          this.unselectShuttle();
        }
        this.shuttleError.next(null);
        this.renewApiSubscription();
      },
      err => {
        console.error('Failed to delete shuttle', err);
        this.shuttleError.next(this.formatHttpError(err, 'delete shuttle'));
      }
    );
  }

  private authHeaders(extra: { [key: string]: string } = {}, tokenOverride?: string): HttpHeaders {
    const rawToken = tokenOverride !== undefined ? tokenOverride : environment.SHUTTLE.TOKEN;
    const token = rawToken ? rawToken.trim() : '';
    const headerMap: { [key: string]: string } = { ...extra };
    if (token) {
      headerMap.token = token;
    }
    return new HttpHeaders(headerMap);
  }

  private parseNumericIdList(value: any): string[] {
    if (value === null || value === undefined || value === '') {
      return [];
    }
    const parts = Array.isArray(value)
      ? value.map(v => String(v).trim()).filter(Boolean)
      : String(value).split(/[,;/|\s]+/).map(v => v.trim()).filter(Boolean);

    if (parts.length === 0 || !parts.every(part => /^\d+$/.test(part))) {
      return [];
    }

    const seen = new Set<string>();
    const ids: string[] = [];
    parts.forEach(part => {
      if (part !== '0' && !seen.has(part)) {
        seen.add(part);
        ids.push(part);
      }
    });
    return ids;
  }

  private safeJsonParse(raw: string): any {
    try {
      return JSON.parse(raw);
    } catch (err) {
      console.error('Failed to parse Orthanc JSON response', err);
      return null;
    }
  }

  private formatHttpError(err: any, action: string): string {
    if (err && err.status === 401) {
      return 'Unauthorized (401): invalid or missing Orthanc API token.';
    }
    if (err && err.status === 404) {
      return `Not found (404) while attempting to ${action}.`;
    }
    return `Failed to ${action}. Please verify connectivity to Orthanc.`;
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
      const parsedList = typeof list === 'string' ? this.safeJsonParse(list) : list;
      if (parsedList === null) {
        return;
      }

      if (Array.isArray(parsedList)) {
        parsedList.forEach((shuttle) => {
          const _shuttle = new Shuttle();
          _shuttle.id = shuttle.id !== null && shuttle.id !== undefined ? String(shuttle.id) : shuttle.id;
          _shuttle.name = shuttle.name;
          _shuttle.serial_number = shuttle.serial_number;
          _shuttle.class = shuttle.class;
          _shuttle.class_id = shuttle.class_id !== null && shuttle.class_id !== undefined
            ? String(shuttle.class_id)
            : shuttle.class_id;
          _shuttle.type = shuttle.type;
          _shuttle.capacity = shuttle.capacity !== null && shuttle.capacity !== undefined
            ? String(shuttle.capacity)
            : shuttle.capacity;
          _shuttle.armor = shuttle.armor;
          _shuttle.base = shuttle.base;
          _shuttle.state = shuttle.state;
          _shuttle.operable = shuttle.operable !== null && shuttle.operable !== undefined
            ? String(shuttle.operable)
            : shuttle.operable;
          _shuttle.status_name = shuttle.status_name;
          _shuttle.status = shuttle.status !== null && shuttle.status !== undefined
            ? String(shuttle.status)
            : shuttle.status;
          _shuttle.assigned_to_name = shuttle.assigned_to_name;
          _shuttle.assigned_to_id = shuttle.assigned_to_id;
          _shuttle.required_skill = shuttle.required_skill;
          _shuttle.required_skill_id = shuttle.required_skill_id !== null && shuttle.required_skill_id !== undefined
            ? String(shuttle.required_skill_id)
            : shuttle.required_skill_id;
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
      const updated = shuttles.find(s => String(s.id) === String(current.id));
      if (updated) {
        this.selectShuttle(updated);
      }
    }
  }

  private getShuttlesFromAPI(): Observable<any> {
    const httpOptions: object = {
      headers: this.authHeaders({ getAll: 'true' }),
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
        this.shuttleError.next(null);
        this.setShuttleList(shuttles);
      },
      (err) => {
        console.error('Failed to load shuttles', err);
        this.shuttleError.next(this.formatHttpError(err, 'load shuttles'));
      }
    );
  }
}
