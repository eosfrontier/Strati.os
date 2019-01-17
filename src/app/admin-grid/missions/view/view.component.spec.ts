import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsViewComponent } from './view.component';

describe('ViewComponent', () => {
  let component: MissionsViewComponent;
  let fixture: ComponentFixture<MissionsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
