import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './components/menu/menu.component';
import { TopComponent } from './components/top/top.component';
import { ClockComponent } from './components/clock/clock.component';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [MenuComponent, TopComponent, ClockComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
  ],
  exports: [
    MenuComponent,
    TopComponent,
    ClockComponent
  ]
})
export class SharedModule { }
