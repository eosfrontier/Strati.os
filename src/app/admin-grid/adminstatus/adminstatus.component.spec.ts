import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminstatusComponent } from './adminstatus.component';

describe('AdminstatusComponent', () => {
  let component: AdminstatusComponent;
  let fixture: ComponentFixture<AdminstatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminstatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
