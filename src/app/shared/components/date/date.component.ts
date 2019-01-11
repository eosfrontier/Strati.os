import { Component, OnInit, OnDestroy } from '@angular/core';
import { DateService } from '../../services/date.service';
import { IcDate } from '../../models/icdate';

@Component({
  selector: 'app-shared-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent implements OnInit, OnDestroy {

  dateSubscription: any;
  dateReceived: boolean;
  icDate$: IcDate;

  constructor(private dateService: DateService) { }

  ngOnInit() {
    this.dateSubscription = this.dateService.getIcDate().subscribe(res => {
      if (res) {
        this.icDate$ = res;
        this.dateReceived = true;
      }
    });
  }

  ngOnDestroy() {
    this.dateSubscription.unsubscribe();
  }

}
