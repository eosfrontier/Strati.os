import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Fob } from '../../shared/models/fob';
import { FobService } from '../../shared/services/fob.service';
import { Subscription } from 'rxjs';
import { SupplyBreakpoints } from '../../shared/models/supplybreakpoints';
import { faBoxes, faHeartbeat, faMapMarkerAlt, faTimes, faUserShield } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-base-modal',
  templateUrl: './base-modal.component.html',
  styleUrls: ['./base-modal.component.scss']
})
export class BaseModalComponent implements OnInit, OnDestroy {
  fobSubscription: Subscription;
  fobData: Fob;
  supplyBreakpoints: SupplyBreakpoints;

  faTimes = faTimes
  faMapMarkerAlt = faMapMarkerAlt
  faHeartbeat = faHeartbeat
  faUserShield = faUserShield
  faBoxes = faBoxes

  constructor(private fobService: FobService) { }

  ngOnInit() {
    this.fobSubscription = this.fobService.getSelectedFob().subscribe(fob => {
      this.fobData = fob;
    });
    this.supplyBreakpoints = new SupplyBreakpoints();
    console.log(this.supplyBreakpoints);
  }

  closeModal() {
    this.fobService.unselectFob();
  }

  ngOnDestroy() {
    this.fobSubscription.unsubscribe();
  }
}
