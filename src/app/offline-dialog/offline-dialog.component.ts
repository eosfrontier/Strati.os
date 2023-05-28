import { Component, OnInit, OnDestroy } from '@angular/core';
import { OnlineService } from '../shared/services/connection/online.service';
import { Subscription } from 'rxjs';
import { faSatellite } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-offline-dialog',
  templateUrl: './offline-dialog.component.html',
  styleUrls: ['./offline-dialog.component.scss']
})
export class OfflineDialogComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  isOnline: boolean;

  faSatellite = faSatellite

  constructor(private onlineStatus: OnlineService) { }

  ngOnInit() {
    this.subscription = this.onlineStatus.onlineStatus.subscribe(
      status => this.isOnline = status
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
