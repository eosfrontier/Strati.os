import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ShuttlesEditComponent } from './edit.component';
import { FormErrorFieldComponent } from '../../../shared/components/form-error-field/form-error-field.component';
import { ShuttleService } from '../../../shared/services/shuttle.service';
import { AdminMenuService } from '../../admin-menu.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Shuttle } from '../../../shared/models/shuttle';
import { environment } from '../../../../environments/environment';

describe('ShuttlesEditComponent', () => {
  let component: ShuttlesEditComponent;
  let fixture: ComponentFixture<ShuttlesEditComponent>;
  let shuttleService: ShuttleService;
  let adminMenu: AdminMenuService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      declarations: [ShuttlesEditComponent, FormErrorFieldComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    TestBed.inject(AuthService).setAuthStatus(34471);
    shuttleService = TestBed.inject(ShuttleService);
    adminMenu = TestBed.inject(AdminMenuService);
    httpMock = TestBed.inject(HttpTestingController);
    httpMock.match(environment.SHUTTLE.API_URL);
  });

  it('should pre-fill all fields and preserve non-edited metadata on save', () => {
    const existing = new Shuttle();
    existing.id = '4';
    existing.name = 'FireBird';
    existing.serial_number = 'FH-001';
    existing.class = 'Runner-Class';
    existing.class_id = '3';
    existing.type = 'Fast Supply Carrier';
    existing.capacity = '2';
    existing.base = 'Fennik';
    existing.state = 'Fully operational';
    existing.operable = '1';
    existing.status_name = 'On Mission';
    existing.status = '2';
    existing.assigned_to_name = 'Sergei Konstantinova';
    existing.assigned_to_id = '99';
    existing.required_skill = 'Balance / Vliegbrevet';
    existing.required_skill_id = '31152';

    shuttleService.selectShuttle(existing);

    fixture = TestBed.createComponent(ShuttlesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.name.value).toEqual('FireBird');
    expect(component.base.value).toEqual('Fennik');
    expect(component.shuttleForm.controls.operable.value).toBeTruthy();

    spyOn(shuttleService, 'updateShuttle');
    component.shuttleForm.patchValue({
      state: 'Under maintenance',
      status_name: 'Ready',
      operable: false
    });

    component.submitShuttle();

    expect(shuttleService.updateShuttle).toHaveBeenCalled();
    const updated = (shuttleService.updateShuttle as jasmine.Spy).calls.mostRecent().args[0];
    expect(updated.id).toEqual('4');
    expect(updated.class_id).toEqual('3');
    expect(updated.assigned_to_name).toEqual('Sergei Konstantinova');
    expect(updated.state).toEqual('Under maintenance');
    expect(updated.status_name).toEqual('Ready');
    expect(updated.status).toEqual('0');
    expect(updated.operable).toEqual('0');
    expect(shuttleService.selectedShuttle.getValue()).toBeNull();
    expect(adminMenu.selectedMenuItem.getValue()).toEqual('shuttleView');
  });

  it('should render error message when no shuttle is selected', () => {
    shuttleService.unselectShuttle();
    fixture = TestBed.createComponent(ShuttlesEditComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('ERR: No selected shuttle.');
  });
});
