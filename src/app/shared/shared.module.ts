import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './components/menu/menu.component';
import { TopComponent } from './components/top/top.component';
import { ClockComponent } from './components/clock/clock.component';

@NgModule({
  declarations: [MenuComponent, TopComponent, ClockComponent],
  imports: [
    CommonModule
  ],
  exports: [
    MenuComponent,
    TopComponent,
    ClockComponent
  ]
})
export class SharedModule { }
