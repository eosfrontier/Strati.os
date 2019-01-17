import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsEditComponent } from './edit.component';

describe('EditComponent', () => {
  let component: MissionsEditComponent;
  let fixture: ComponentFixture<MissionsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
