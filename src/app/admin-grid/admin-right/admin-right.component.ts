import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminMenuService } from '../admin-menu.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-admin-right',
  templateUrl: './admin-right.component.html',
  styleUrls: ['./admin-right.component.scss']
})
export class AdminRightComponent implements OnInit, OnDestroy {

  selectedMenuItem: string;
  authStatus: boolean;
  private menuSubscription: Subscription;
  authSubscription: Subscription;

  constructor(private adminMenuService: AdminMenuService, private auth: AuthService) { }

  ngOnInit() {
    this.menuSubscription = this.adminMenuService.getSelectedMenuItem().subscribe(item => {
      this.selectedMenuItem = item;
    });
    this.authSubscription = this.auth.getAuthStatus().subscribe(
      auth => this.authStatus = auth
    );
  }

  public selectMenuItem(input: string): void {
    this.adminMenuService.setSelectedMenuItem(input);
  }

  logout(): void {
    this.adminMenuService.logout();
  }

  ngOnDestroy() {
    this.menuSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

}
