import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FobGridComponent } from './fob-grid.component';
import { SharedModule } from '../shared/shared.module';
import { FobOverviewComponent } from './fob-overview/fob-overview.component';
import { BaseComponent } from './base/base.component';

@NgModule({
  declarations: [FobGridComponent, FobOverviewComponent, BaseComponent],
  imports: [
    CommonModule, SharedModule
  ]
})
export class FobGridModule { }
