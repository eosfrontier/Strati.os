import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuRightComponent } from './menu-right/menu-right.component';
import { AdminGridComponent } from './admin-grid.component';
import { ViewComponent } from './missions/view/view.component';
import { AddComponent } from './missions/add/add.component';
import { EditComponent } from './missions/edit/edit.component';

import { SharedModule } from '../shared/shared.module';
import { AdminRightComponent } from './admin-right/admin-right.component';

@NgModule({
  declarations: [
    MenuRightComponent,
    AdminGridComponent,
    ViewComponent,
    AddComponent,
    EditComponent,
    AdminRightComponent,
  ],
  imports: [
    CommonModule, SharedModule
  ]
})
export class AdminGridModule { }
