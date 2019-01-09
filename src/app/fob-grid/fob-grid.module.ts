import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FobGridComponent } from './fob-grid.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [FobGridComponent],
  imports: [
    CommonModule, SharedModule
  ]
})
export class FobGridModule { }
