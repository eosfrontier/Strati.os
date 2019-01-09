import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FobGridComponent } from './fob-grid.component';

describe('FobGridComponent', () => {
  let component: FobGridComponent;
  let fixture: ComponentFixture<FobGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FobGridComponent ]
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
