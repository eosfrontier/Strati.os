import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ShuttlesAddComponent } from './add.component';
import { FormErrorFieldComponent } from '../../../shared/components/form-error-field/form-error-field.component';
import { ShuttleService } from '../../../shared/services/shuttle.service';
import { AdminMenuService } from '../../admin-menu.service';
import { AuthService } from '../../../shared/services/auth.service';
import { environment } from '../../../../environments/environment';

describe('ShuttlesAddComponent', () => {
  let component: ShuttlesAddComponent;
  let fixture: ComponentFixture<ShuttlesAddComponent>;
  let shuttleService: ShuttleService;
  let adminMenu: AdminMenuService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      declarations: [ShuttlesAddComponent, FormErrorFieldComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    TestBed.inject(AuthService).setAuthStatus(34471);
    shuttleService = TestBed.inject(ShuttleService);
    adminMenu = TestBed.inject(AdminMenuService);
    httpMock = TestBed.inject(HttpTestingController);
    httpMock.match(environment.SHUTTLE.API_URL);

    fixture = TestBed.createComponent(ShuttlesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should require name, serial_number, and class before submitting', () => {
    expect(component.shuttleForm.valid).toBeFalsy();

    component.shuttleForm.patchValue({
      name: 'Mouse',
      serial_number: 'MS-558-50',
      class: 'AM-50 Razor interceptor'
    });
    expect(component.shuttleForm.valid).toBeTruthy();
  });

  it('should submit new shuttle with extended fields and return to shuttleView', () => {
    spyOn(shuttleService, 'createNewShuttle');

    component.shuttleForm.patchValue({
      name: 'Ambrotos',
      serial_number: 'AS-1498',
      class: 'Ammasarius-class multirole shuttle',
      type: 'Personnel Carrier',
      capacity: 16,
      base: 'Bastion',
      state: 'Fully operational',
      status_name: 'Ready',
      operable: true,
      required_skill: 'Balance / Vliegbrevet'
    });

    component.submitShuttle();

    expect(shuttleService.createNewShuttle).toHaveBeenCalled();
    const submitted = (shuttleService.createNewShuttle as jasmine.Spy).calls.mostRecent().args[0];
    expect(submitted.name).toEqual('Ambrotos');
    expect(submitted.serial_number).toEqual('AS-1498');
    expect(submitted.capacity).toEqual('16');
    expect(submitted.status).toEqual('0');
    expect(submitted.operable).toEqual('1');
    expect(adminMenu.selectedMenuItem.getValue()).toEqual('shuttleView');
  });
});
