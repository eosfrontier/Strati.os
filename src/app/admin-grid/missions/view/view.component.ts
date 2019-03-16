import { Component, OnInit, OnDestroy } from '@angular/core';
import { MissionService } from '../../../shared/services/mission.service';
import { Subscription } from 'rxjs';
import { Mission } from '../../../shared/models/mission';
import { AdminMenuService } from '../../admin-menu.service';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-mission-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class MissionsViewComponent implements OnInit, OnDestroy {

  missionList: Mission[];
  missionSubscription: Subscription;

  constructor(
    private missionService: MissionService,
    private adminRouter: AdminMenuService,
    private orderPipe: OrderPipe
  ) { }

  ngOnInit() {
    this.missionSubscription = this.missionService.getMissionList().subscribe(missions => {
      this.missionList = missions;
    });
  }

  deleteMission(mission: Mission): void {
    this.missionService.deleteMission(mission);
  }

  selectMission(mission: Mission): void {
    this.missionService.selectMission(mission);
    this.adminRouter.setSelectedMenuItem('missionEdit');
  }

  ngOnDestroy() {
    this.missionSubscription.unsubscribe();
  }
}
