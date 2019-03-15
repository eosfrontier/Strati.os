import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormErrorFieldComponent } from './form-error-field.component';

describe('FormErrorFieldComponent', () => {
  let component: FormErrorFieldComponent;
  let fixture: ComponentFixture<FormErrorFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormErrorFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormErrorFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
