import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Mission } from '../models/mission';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MissionService {

  apiSubscription: Subscription;
  missionList: BehaviorSubject<Mission[]> = new BehaviorSubject(null);
  selectedMission: BehaviorSubject<Mission> = new BehaviorSubject(null);

  constructor(private http: HttpClient) {
    this.renewApiSubscription();
  }

  public getMissionList(): Observable<Mission[]> {
    return this.missionList.asObservable();
  }

  private setMissionList(list: Mission[]): void {
    this.missionList.next(list);
  }

  public selectMission(selected: Mission): void {
    this.selectedMission.next(selected);
  }

  public socketUpdateTrigger(): void {
    console.log('socketupdatetrigger');
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
      departureTime.setHours(formData.departureTime.split(':')[0]);
      departureTime.setMinutes(formData.departureTime.split(':')[1]);

    const mission = new Mission();
      mission._id = formData._id;
      mission.priority = formData.priority;
      mission.creationtimestamp = Date.now();
      mission.type = formData.type;
      mission.goal = formData.goal;
      mission.title = formData.title;
      mission.xo = formData.xo;
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
