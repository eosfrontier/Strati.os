import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './grid.component';
import { SideComponent } from './side/side.component';
import { FooterLeftComponent } from './footer-left/footer-left.component';
import { MainComponent } from './main/main.component';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [GridComponent, SideComponent, FooterLeftComponent, MainComponent ],
  imports: [
    CommonModule, SharedModule
  ]
})
export class GridModule { }
