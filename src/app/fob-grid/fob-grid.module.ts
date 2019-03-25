import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FobGridComponent } from './fob-grid.component';
import { SharedModule } from '../shared/shared.module';
import { FobOverviewComponent } from './fob-overview/fob-overview.component';
import { BaseComponent } from './base/base.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BaseModalComponent } from './base-modal/base-modal.component';
import { OrderModule } from 'ngx-order-pipe';

@NgModule({
  declarations: [FobGridComponent, FobOverviewComponent, BaseComponent, BaseModalComponent],
  imports: [
    CommonModule, SharedModule, FontAwesomeModule, OrderModule
  ]
})
export class FobGridModule { }
