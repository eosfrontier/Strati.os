import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuRightComponent } from './menu-right/menu-right.component';
import { AdminGridComponent } from './admin-grid.component';
import { MissionsViewComponent } from './missions/view/view.component';
import { MissionsAddComponent } from './missions/add/add.component';
import { MissionsEditComponent } from './missions/edit/edit.component';

import { SharedModule } from '../shared/shared.module';
import { AdminRightComponent } from './admin-right/admin-right.component';
import { AddFobComponent } from './fobs/add/add.component';
import { EditFobComponent } from './fobs/edit/edit.component';
import { ViewFobComponent } from './fobs/view/view.component';
import { AdminRouterComponent } from './admin-router/admin-router.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminstatusComponent } from './adminstatus/adminstatus.component';
import { OrderModule } from 'ngx-order-pipe';

@NgModule({
  declarations: [
    MenuRightComponent,
    AdminGridComponent,
    MissionsViewComponent,
    MissionsAddComponent,
    MissionsEditComponent,
    AdminRightComponent,
    AddFobComponent,
    EditFobComponent,
    ViewFobComponent,
    AdminRouterComponent,
    AdminstatusComponent,
  ],
  imports: [
    CommonModule, SharedModule, FontAwesomeModule, ReactiveFormsModule, FormsModule, OrderModule
  ]
})
export class AdminGridModule { }
