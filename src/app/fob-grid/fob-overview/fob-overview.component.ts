import { Component, OnInit, OnDestroy } from '@angular/core';
import { Fob } from '../../shared/models/fob';
import { FobService } from '../../shared/services/fob.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fob-overview',
  templateUrl: './fob-overview.component.html',
  styleUrls: ['./fob-overview.component.scss']
})
export class FobOverviewComponent implements OnInit, OnDestroy {

  fobList: Fob[];
  fobListSubscription: Subscription;
  fobSubscription: Subscription;
  selectedFob: Fob;

  constructor(private fobService: FobService) { }

  ngOnInit() {
    this.fobListSubscription = this.fobService.getFobList().subscribe(fobs => {
      this.fobList = fobs;
      // console.log(fobs); // logs WITH _id attached.
    });
    this.fobSubscription = this.fobService.getSelectedFob().subscribe(fob => {
      this.selectedFob = fob;
    });
  }

  selectFob(fob: Fob) {
    this.fobService.selectFob(fob);
  }

  ngOnDestroy() {
    this.fobListSubscription.unsubscribe();
    this.fobSubscription.unsubscribe();
  }
}
