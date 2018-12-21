import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuRightComponent } from './menu-right/menu-right.component';
import { AdminGridComponent } from './admin-grid.component';
import { AdminLeftComponent } from './admin-left/admin-left.component';
import { ViewComponent } from './missions/view/view.component';
import { AddComponent } from './missions/add/add.component';
import { EditComponent } from './missions/edit/edit.component';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    MenuRightComponent,
    AdminGridComponent,
    AdminLeftComponent,
    ViewComponent,
    AddComponent,
    EditComponent,
  ],
  imports: [
    CommonModule, SharedModule
  ]
})
export class AdminGridModule { }
