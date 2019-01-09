import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './grid.component';
import { SideComponent } from './side/side.component';
import { FooterLeftComponent } from './footer-left/footer-left.component';
import { MainComponent } from './main/main.component';

import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [GridComponent, SideComponent, FooterLeftComponent, MainComponent, FooterComponent ],
  imports: [
    CommonModule, SharedModule, FontAwesomeModule
  ]
})
export class GridModule { }
