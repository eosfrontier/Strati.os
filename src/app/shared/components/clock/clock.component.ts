import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClockService } from '../../services/clock.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit, OnDestroy {

  private clockSubscription$: Subscription;
  time: Date;

  constructor(private clockService: ClockService) { }

  ngOnInit() {
    this.clockSubscription$ = this.clockService.getClock().subscribe(
      time => this.time = time
    );
  }

  ngOnDestroy() {
    this.clockSubscription$.unsubscribe();
  }

}
