import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Shuttle } from '../../../shared/models/shuttle';
import { ShuttleService } from '../../../shared/services/shuttle.service';
import { AdminMenuService } from '../../admin-menu.service';

@Component({
  selector: 'app-shuttle-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ShuttlesViewComponent implements OnInit, OnDestroy {

  shuttleList: Shuttle[];
  shuttleError: string;
  shuttleSubscription: Subscription;
  errorSubscription: Subscription;

  constructor(
    private shuttleService: ShuttleService,
    private adminRouter: AdminMenuService
  ) { }

  ngOnInit() {
    this.shuttleSubscription = this.shuttleService.getShuttleList().subscribe(shuttles => {
      this.shuttleList = shuttles;
    });
    this.errorSubscription = this.shuttleService.getShuttleError().subscribe(err => {
      this.shuttleError = err;
    });
  }

  addShuttle(): void {
    this.shuttleService.unselectShuttle();
    this.adminRouter.setSelectedMenuItem('shuttleAdd');
  }

  selectShuttle(shuttle: Shuttle): void {
    this.shuttleService.selectShuttle(shuttle);
    this.adminRouter.setSelectedMenuItem('shuttleEdit');
  }

  deleteShuttle(shuttle: Shuttle): void {
    this.shuttleService.deleteShuttle(shuttle);
  }

  getStatusClass(shuttle: Shuttle): string {
    if (!shuttle) {
      return '';
    }
    if (shuttle.operable === '0') {
      return 'red';
    }
    const status = (shuttle.status_name || '').trim().toLowerCase();
    if (status === 'ready') {
      return 'green';
    }
    if (status === 'on mission') {
      return 'blue';
    }
    if (status) {
      return 'orange';
    }
    return '';
  }

  ngOnDestroy() {
    if (this.shuttleSubscription) {
      this.shuttleSubscription.unsubscribe();
    }
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
  }
}
