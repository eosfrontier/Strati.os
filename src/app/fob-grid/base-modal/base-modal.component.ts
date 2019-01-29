import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Fob } from '../../shared/models/fob';
import { FobService } from '../../shared/services/fob.service';
import { Subscription } from 'rxjs';
import { SupplyBreakpoints } from '../../shared/models/supplybreakpoints';

@Component({
  selector: 'app-base-modal',
  templateUrl: './base-modal.component.html',
  styleUrls: ['./base-modal.component.scss']
})
export class BaseModalComponent implements OnInit, OnDestroy {

  fobSubscription: Subscription;
  fobData: Fob;
  supplyBreakpoints: SupplyBreakpoints;

  constructor(private fobService: FobService) { }

  ngOnInit() {
    this.fobSubscription = this.fobService.getSelectedFob().subscribe(fob => {
      this.fobData = fob;
    });
    this.supplyBreakpoints = new SupplyBreakpoints();
  }

  closeModal() {
    this.fobService.unselectFob();
  }

  ngOnDestroy() {
    this.fobSubscription.unsubscribe();
  }
}
