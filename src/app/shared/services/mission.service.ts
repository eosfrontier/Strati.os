import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Mission } from '../models/mission';
import { environment } from '../../../environments/environment';
import { DateService } from './date.service';


@Injectable({
  providedIn: 'root'
})
export class MissionService {

  apiSubscription: Subscription;
  missionList: BehaviorSubject<Mission[]> = new BehaviorSubject(null);
  selectedMission: BehaviorSubject<Mission> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private dateService: DateService
  ) {
    this.renewApiSubscription();
  }

  public getMissionList(): Observable<Mission[]> {
    return this.missionList.asObservable();
  }

  private setMissionList(list: Mission[]): void {
    this.missionList.next(this.sortMissions(list));
  }

  /**
   * @description returns a new array sorted by IC date ascending, then departure time (HH:mm) ascending, then priority.
   */
  public sortMissions(missions: Mission[]): Mission[] {
    if (!missions) {
      return missions;
    }
    return [...missions].sort((a, b) => this.compareMissions(a, b));
  }

  private compareMissions(a: Mission, b: Mission): number {
    const dateDiff = this.compareNumbers(
      this.dateService.getIcDateSortKey(a && a.icdate),
      this.dateService.getIcDateSortKey(b && b.icdate)
    );
    if (dateDiff !== 0) {
      return dateDiff;
    }

    const timeDiff = this.compareNumbers(
      this.getDepartureTimeSortKey(a && a.departureTime),
      this.getDepartureTimeSortKey(b && b.departureTime)
    );
    if (timeDiff !== 0) {
      return timeDiff;
    }

    return this.compareNumbers(
      this.getPrioritySortKey(a && a.priority),
      this.getPrioritySortKey(b && b.priority)
    );
  }

  private getDepartureTimeSortKey(departureTime: Date | string): number {
    if (departureTime == null || departureTime === '') {
      return Infinity;
    }
    const date = new Date(departureTime);
    if (isNaN(date.getTime())) {
      return Infinity;
    }
    return date.getHours() * 60 + date.getMinutes();
  }

  private getPrioritySortKey(priority: number): number {
    if (priority == null || isNaN(Number(priority))) {
      return Infinity;
    }
    return Number(priority);
  }

  private compareNumbers(a: number, b: number): number {
    if (a === b) {
      return 0;
    }
    return a < b ? -1 : 1;
  }

  public selectMission(selected: Mission): void {
    this.selectedMission.next(selected);
  }

  public socketUpdateTrigger(): void {
    this.renewApiSubscription();
  }

  private renewApiSubscription(): void {
    this.apiSubscription = this.getMissionsFromAPI().subscribe((missions) => {
      this.setMissionList(missions);
    });
  }

  /**
   * @description set the selected mission to NULL; this way the components will no longer detect a selected mission.
   */
  public unselectMission(): void {
    this.selectedMission.next(null);
  }

  public getSelectedMission(): Observable<Mission> {
    return this.selectedMission.asObservable();
  }

  private getMissionsFromAPI(): Observable<any> {
    return this.http.get(environment.MISSIONS.API_URL).pipe(
      map(res => {
        return res;
      })
    );
  }

  /** ******** FORM ********** */
  public convertFormDataToMission(formData: any): Mission {

    const departureTime = new Date();
      departureTime.setSeconds(0);
      departureTime.setMilliseconds(0);
      departureTime.setHours(formData.departureTime.split(':')[0]);
      departureTime.setMinutes(formData.departureTime.split(':')[1]);

    const rawIcDate = typeof formData.icdate === 'string' ? formData.icdate.trim() : '';
    const icdate = rawIcDate
      ? this.dateService.normalizeIcDate(rawIcDate)
      : this.dateService.getCurrentIcDateString();

    const mission = new Mission();
      mission._id = formData._id;
      mission.priority = formData.priority;
      mission.creationtimestamp = Date.now();
      mission.type = formData.type;
      mission.goal = formData.goal;
      mission.title = formData.title;
      mission.xo = formData.xo;
      mission.icdate = icdate;
      mission.colorcode = formData.colorcode;
      mission.authorised = formData.authorised;
      mission.authorisedby = formData.authorisedby;
      mission.departureTime = departureTime;
      mission.shuttle = formData.shuttle;
      mission.editcounter = 0;
      mission.delayed = false;
    return mission;
  }

  public createNewMission(mission: Mission): void {
    this.http.post(environment.MISSIONS.API_URL + 'new', mission).subscribe(
      data => {
        console.log(data);
      }
    );
  }

  public deleteMission(mission: Mission): void {
    this.http.post(environment.MISSIONS.API_URL + 'delete', mission).subscribe(
      data => {
        console.log(data);
      }
    );
  }

  public updateMission(mission: Mission): void {
    this.http.post(environment.MISSIONS.API_URL + 'update', mission).subscribe(
      data => {
        console.log(data);
      }
    );
  }

}
