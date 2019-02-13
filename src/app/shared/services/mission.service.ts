import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Mission } from '../models/mission';
import { environment } from '../../../environments/environment';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class MissionService {

  missionList: BehaviorSubject<Mission[]> = new BehaviorSubject(null);
  selectedMission: BehaviorSubject<Mission> = new BehaviorSubject(null);

  constructor(private http: HttpClient, private socketService: SocketService) {
    this.getMissionsFromAPI().subscribe((missions) => {
      this.setMissionList(missions);
    });
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


}
