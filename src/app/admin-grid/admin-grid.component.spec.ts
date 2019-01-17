import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGridComponent } from './admin-grid.component';
import { SharedModule } from '../shared/shared.module';
import { FobGridModule } from '../fob-grid/fob-grid.module';
import { GridModule } from '../home-grid/grid.module';
import { RouterModule } from '@angular/router';
import { ErrorPageComponent } from '../error-page/error-page.component';
import { AdminGridModule } from './admin-grid.module';
import { AdminRightComponent } from './admin-right/admin-right.component';
import { MenuRightComponent } from './menu-right/menu-right.component';
import { MissionsViewComponent } from './missions/view/view.component';
import { MissionsEditComponent } from './missions/edit/edit.component';
import { MissionsAddComponent } from './missions/add/add.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('AdminGridComponent', () => {
  let component: AdminGridComponent;
  let fixture: ComponentFixture<AdminGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdminGridComponent,
        ErrorPageComponent,
        AdminRightComponent,
        MenuRightComponent,
        MissionsViewComponent,
        MissionsEditComponent,
        MissionsAddComponent
      ],
      imports: [SharedModule, FobGridModule, GridModule, RouterModule, FontAwesomeModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
