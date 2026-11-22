import { Component, OnInit, OnDestroy } from '@angular/core';
import { MissionService } from '../../shared/services/mission.service';
import { DateService } from '../../shared/services/date.service';
import { Subscription } from 'rxjs';
import { Mission } from '../../shared/models/mission';
import { IcDate } from '../../shared/models/icdate';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.scss']
})
export class MissionsComponent implements OnInit, OnDestroy {

  missionList: Mission[];
  missionSubscription: Subscription;
  dateSubscription: Subscription;
  currentIcDate: IcDate;

  faChevronDown = faChevronDown;

  constructor(
    private missionService: MissionService,
    private dateService: DateService
  ) { }

  ngOnInit(): void {
    this.missionSubscription = this.missionService.getMissionList().subscribe(
      missions => this.missionList = this.missionService.sortMissions(missions)
    );
    this.dateSubscription = this.dateService.getIcDate().subscribe(
      icDate => this.currentIcDate = icDate
    );
  }

  getDayOfWeek(icdate: string): string {
    return this.dateService.getIcDayOfWeek(icdate, this.currentIcDate);
  }

  ngOnDestroy(): void {
    if (this.missionSubscription) {
      this.missionSubscription.unsubscribe();
    }
    if (this.dateSubscription) {
      this.dateSubscription.unsubscribe();
    }
  }
}
