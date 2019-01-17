import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridComponent } from './grid.component';
import { ErrorPageComponent } from '../error-page/error-page.component';
import { SharedModule } from '../shared/shared.module';
import { AdminGridModule } from '../admin-grid/admin-grid.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FobGridModule } from '../fob-grid/fob-grid.module';
import { SideComponent } from './side/side.component';
import { FooterComponent } from './footer/footer.component';
import { FooterLeftComponent } from './footer-left/footer-left.component';
import { MissionsComponent } from './missions/missions.component';

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GridComponent, ErrorPageComponent, SideComponent,
        FooterComponent, FooterLeftComponent, MissionsComponent
      ],
      imports: [
        SharedModule, AdminGridModule, FontAwesomeModule,
        FobGridModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
