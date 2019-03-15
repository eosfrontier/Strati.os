import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './grid.component';
import { SideComponent } from './side/side.component';
import { FooterLeftComponent } from './footer-left/footer-left.component';

import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MissionsComponent } from './missions/missions.component';
import { OrderModule } from 'ngx-order-pipe';

@NgModule({
  declarations: [
    GridComponent, SideComponent, FooterLeftComponent, FooterComponent, MissionsComponent
  ],
  imports: [
    CommonModule, SharedModule, FontAwesomeModule, OrderModule
  ]
})
export class GridModule { }
