import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FobGridComponent } from './fob-grid.component';
import { ErrorPageComponent } from '../error-page/error-page.component';
import { SharedModule } from '../shared/shared.module';
import { GridModule } from '../home-grid/grid.module';
import { AdminGridModule } from '../admin-grid/admin-grid.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FobGridModule } from './fob-grid.module';
import { FobOverviewComponent } from './fob-overview/fob-overview.component';

describe('FobGridComponent', () => {
  let component: FobGridComponent;
  let fixture: ComponentFixture<FobGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FobGridComponent, ErrorPageComponent, FobOverviewComponent ],
      imports: [
        SharedModule, GridModule, AdminGridModule, FontAwesomeModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FobGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
