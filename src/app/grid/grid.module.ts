import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './grid.component';
import { ClockComponent } from './clock/clock.component';
import { SideComponent } from './side/side.component';
import { FooterLeftComponent } from './footer-left/footer-left.component';
import { MainComponent } from './main/main.component';

import { MenuComponent } from '../shared/menu/menu.component';
import { TopComponent } from '../shared/top/top.component';

@NgModule({
  declarations: [GridComponent, TopComponent, ClockComponent, SideComponent, FooterLeftComponent, MainComponent, MenuComponent],
  imports: [
    CommonModule
  ]
})
export class GridModule { }
