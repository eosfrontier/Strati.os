import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterLeftComponent } from './footer-left.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from 'src/app/shared/shared.module';
import { GridComponent } from '../grid.component';
import { FobGridModule } from 'src/app/fob-grid/fob-grid.module';
import { AdminGridModule } from 'src/app/admin-grid/admin-grid.module';
import { ErrorPageComponent } from 'src/app/error-page/error-page.component';
import { SideComponent } from '../side/side.component';
import { MissionsComponent } from '../missions/missions.component';
import { FooterComponent } from '../footer/footer.component';

describe('FooterLeftComponent', () => {
  let component: FooterLeftComponent;
  let fixture: ComponentFixture<FooterLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterLeftComponent, GridComponent,
        ErrorPageComponent, SideComponent, MissionsComponent,
      FooterComponent ],
      imports: [ FontAwesomeModule, SharedModule, FobGridModule, AdminGridModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
