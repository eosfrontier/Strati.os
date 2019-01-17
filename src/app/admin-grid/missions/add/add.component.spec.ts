import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsAddComponent } from './add.component';

describe('AddComponent', () => {
  let component: MissionsAddComponent;
  let fixture: ComponentFixture<MissionsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
