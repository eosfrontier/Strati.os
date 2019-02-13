import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminMenuService } from '../admin-menu.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-right',
  templateUrl: './admin-right.component.html',
  styleUrls: ['./admin-right.component.scss']
})
export class AdminRightComponent implements OnInit, OnDestroy {

  selectedMenuItem: string;
  private subscription: Subscription;

  constructor(private adminMenuService: AdminMenuService) { }

  ngOnInit() {
    this.subscription = this.adminMenuService.getSelectedMenuItem().subscribe(item => {
      this.selectedMenuItem = item;
    });
  }

  public selectMenuItem(input: string): void {
    this.adminMenuService.setSelectedMenuItem(input);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
