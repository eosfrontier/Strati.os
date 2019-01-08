import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {

  loggedIn: boolean;
  loginSubscription$: Subscription;

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
