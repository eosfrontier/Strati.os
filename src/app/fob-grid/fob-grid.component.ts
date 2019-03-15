import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IcDate } from '../shared/models/icdate';
import { DateService } from '../shared/services/date.service';

@Component({
  selector: 'app-fob-grid',
  templateUrl: './fob-grid.component.html',
  styleUrls: ['./fob-grid.component.scss']
})
export class FobGridComponent implements OnInit, OnDestroy {

  private dateSubscription$: Subscription;
  icDate$: IcDate;
  dateReceived: boolean;
  fictionalTimeStandard = 'ETC';

  constructor(private dateService: DateService) { }

  ngOnInit() {
    this.dateSubscription$ = this.dateService.getIcDate().subscribe(res => {
      if (res) {
        this.icDate$ = res;
        this.dateReceived = true;
      }
    });
  }

  ngOnDestroy() {
    this.dateSubscription$.unsubscribe();
  }

}
