import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { TopComponent } from './top/top.component';

@NgModule({
  declarations: [MenuComponent, TopComponent],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
