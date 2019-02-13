import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClockService } from '../shared/services/clock.service';
import { Subscription } from 'rxjs';
import { IcDate } from '../shared/models/icdate';
import { DateService } from '../shared/services/date.service';

@Component({
  selector: 'app-fob-grid',
  templateUrl: './fob-grid.component.html',
  styleUrls: ['./fob-grid.component.scss']
})
export class FobGridComponent implements OnInit, OnDestroy {

  private clockSubscription$: Subscription;
  private dateSubscription$: Subscription;
  time: Date;
  icDate$: IcDate;
  dateReceived: boolean;
  fictionalTimeStandard = 'ETC';

  constructor(private clockService: ClockService, private dateService: DateService) { }

  ngOnInit() {
    this.time = new Date();
    this.clockSubscription$ = this.clockService.getClock().subscribe(
      time => this.time = time
    );
    this.dateSubscription$ = this.dateService.getIcDate().subscribe(res => {
      if (res) {
        this.icDate$ = res;
        this.dateReceived = true;
      }
    });
  }

  ngOnDestroy() {
    this.clockSubscription$.unsubscribe();
    this.dateSubscription$.unsubscribe();
  }

}
