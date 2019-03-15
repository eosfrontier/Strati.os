import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './components/menu/menu.component';
import { TopComponent } from './components/top/top.component';
import { ClockComponent } from './components/clock/clock.component';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DateComponent } from './components/date/date.component';
import { SupplyBreakpointPipe } from './pipes/supply-breakpoint.pipe';
import { FormErrorFieldComponent } from './components/form-error-field/form-error-field.component';

@NgModule({
  declarations: [
    MenuComponent,
    TopComponent,
    ClockComponent,
    DateComponent,
    SupplyBreakpointPipe,
    FormErrorFieldComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
  ],
  exports: [
    MenuComponent,
    TopComponent,
    ClockComponent,
    DateComponent,
    FormErrorFieldComponent,
    SupplyBreakpointPipe,
  ]
})
export class SharedModule { }
