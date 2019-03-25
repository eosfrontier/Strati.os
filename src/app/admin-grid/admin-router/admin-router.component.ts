import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminMenuService } from '../admin-menu.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-router',
  templateUrl: './admin-router.component.html',
  styleUrls: ['./admin-router.component.scss']
})
export class AdminRouterComponent implements OnInit, OnDestroy {

  public selectedMenuItem: string;
  private routeSubscription: Subscription;

  constructor(private adminMenuService: AdminMenuService) { }

  ngOnInit() {
    this.routeSubscription = this.adminMenuService.getSelectedMenuItem().subscribe(item => {
      this.selectedMenuItem = item;
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

}
