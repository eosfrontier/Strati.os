import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { faBroadcastTower, faLock, faLockOpen, faProjectDiagram } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  loggedIn: boolean;
  loginSubscription$: Subscription;

  faProjectDiagram = faProjectDiagram
  faBroadcastTower = faBroadcastTower
  faLock = faLock
  faLockOpen = faLockOpen

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loginSubscription$ = this.authService.getAuthStatus().subscribe(
      boolean => this.loggedIn = boolean
    );
  }

  ngOnDestroy() {
    this.loginSubscription$.unsubscribe();
  }

}
