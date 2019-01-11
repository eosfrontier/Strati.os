import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FobOverviewComponent } from './fob-overview.component';

describe('FobOverviewComponent', () => {
  let component: FobOverviewComponent;
  let fixture: ComponentFixture<FobOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FobOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FobOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
