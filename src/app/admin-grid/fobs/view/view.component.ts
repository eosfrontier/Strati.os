import { Component, OnInit, OnDestroy } from '@angular/core';
import { Fob } from '../../../shared/models/fob';
import { FobService } from '../../../shared/services/fob.service';
import { Subscription } from 'rxjs';
import { AdminMenuService } from '../../admin-menu.service';

@Component({
  selector: 'app-fob-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewFobComponent implements OnInit, OnDestroy {

  fobList: Fob[];
  fobSubscription: Subscription;

  constructor(private fobService: FobService, private adminMenu: AdminMenuService) {}

  ngOnInit() {
    this.fobSubscription = this.fobService.getFobList().subscribe(fobs => {
      this.fobList = fobs;
    });
  }

  public editFob(fob: Fob): void {
    this.fobService.selectFob(fob);
    this.adminMenu.setSelectedMenuItem('fobEdit');
  }

  ngOnDestroy() {
    this.fobSubscription.unsubscribe();
  }

}
