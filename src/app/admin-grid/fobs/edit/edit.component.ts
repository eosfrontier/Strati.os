import { Component, OnInit, OnDestroy } from '@angular/core';
import { FobService } from '../../../shared/services/fob.service';
import { Fob } from 'src/app/shared/models/fob';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fob-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditFobComponent implements OnInit, OnDestroy {

  currentFob: Fob;
  fobSubscription: Subscription;

  constructor(private fobService: FobService) { }

  ngOnInit() {
    this.fobSubscription = this.fobService.getSelectedFob().subscribe(fob => {
      this.currentFob = fob;
    });
  }


  ngOnDestroy() {

  }
}
