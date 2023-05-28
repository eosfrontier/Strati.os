import { Component, OnInit, OnDestroy } from '@angular/core';
import { MissionService } from '../../shared/services/mission.service';
import { Subscription } from 'rxjs';
import { Mission } from '../../shared/models/mission';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.scss']
})
export class MissionsComponent implements OnInit, OnDestroy {

  missionList: Mission[];
  missionSubscription: Subscription;

  faChevronDown = faChevronDown

  constructor(private missionService: MissionService) { }

  ngOnInit(): void {
    this.missionSubscription = this.missionService.getMissionList().subscribe(missions => this.missionList = missions);
  }

  ngOnDestroy(): void {
    this.missionSubscription.unsubscribe();
  }
}
