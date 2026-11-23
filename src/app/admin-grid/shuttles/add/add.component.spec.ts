import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ShuttlesAddComponent } from './add.component';
import { FormErrorFieldComponent } from '../../../shared/components/form-error-field/form-error-field.component';
import { ShuttleService } from '../../../shared/services/shuttle.service';
import { AdminMenuService } from '../../admin-menu.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ShuttleClass } from '../../../shared/models/shuttle';
import { environment } from '../../../../environments/environment';

const MOCK_CLASSES: ShuttleClass[] = [
  {
    id: 2,
    name: 'Ammasarius-class multirole shuttle',
    type: 'Personnel Carrier',
    capacity: 16,
    armor: 'Resists small arms',
    required_skill: '31152',
    required_skill_id: 31152
  },
  {
    id: 1,
    name: 'AM-50 Razor interceptor',
    type: 'Scout',
    capacity: 2,
    armor: null,
    required_skill: 'Dynamic Entry',
    required_skill_id: 31162
  }
];

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
    httpMock.match(r => r.url === environment.SHUTTLE.API_URL && r.headers.get('getAll') === 'true');

    fixture = TestBed.createComponent(ShuttlesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load classes dropdown, show read-only stats, resolve skill names, and submit selected class', () => {
    const classReq = httpMock.expectOne(r =>
      r.url === environment.SHUTTLE.API_URL && r.headers.get('getClasses') === 'true'
    );
    classReq.flush(MOCK_CLASSES);
    fixture.detectChanges();

    expect(component.shuttleForm.valid).toBeFalsy();
    const options: HTMLOptionElement[] = Array.from(fixture.nativeElement.querySelectorAll('select#class option'));
    expect(options.map(o => o.value)).toContain('AM-50 Razor interceptor');
    expect(options.map(o => o.value)).toContain('Ammasarius-class multirole shuttle');

    // Type, capacity, and required_skill should NOT be editable inputs
    expect(fixture.nativeElement.querySelector('input#type')).toBeNull();
    expect(fixture.nativeElement.querySelector('input#capacity')).toBeNull();
    expect(fixture.nativeElement.querySelector('input#required_skill')).toBeNull();

    component.shuttleForm.patchValue({
      name: 'Ambrotos',
      serial_number: 'AS-1498',
      class: 'Ammasarius-class multirole shuttle',
      base: 'Bastion',
      state: 'Fully operational',
      status_name: 'Ready',
      operable: true
    });

    const skillReq = httpMock.expectOne(r =>
      r.url === environment.SKILL.API_URL && r.headers.get('skill_id') === '31152'
    );
    skillReq.flush({ id: 31152, name: 'Balance / Vliegbrevet' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.class-stats__type').textContent.trim()).toEqual('Personnel Carrier');
    expect(fixture.nativeElement.querySelector('.class-stats__capacity').textContent.trim()).toEqual('16');
    expect(fixture.nativeElement.querySelector('.class-stats__armor').textContent.trim()).toEqual('Resists small arms');
    expect(fixture.nativeElement.querySelector('.class-stats__skill').textContent.trim()).toEqual('Balance / Vliegbrevet');
    expect(component.shuttleForm.valid).toBeTruthy();

    spyOn(shuttleService, 'createNewShuttle');
    component.submitShuttle();

    expect(shuttleService.createNewShuttle).toHaveBeenCalled();
    const submitted = (shuttleService.createNewShuttle as jasmine.Spy).calls.mostRecent().args[0];
    expect(submitted.name).toEqual('Ambrotos');
    expect(submitted.class).toEqual('Ammasarius-class multirole shuttle');
    expect(submitted.class_id).toEqual('2');
    expect(submitted.type).toEqual('Personnel Carrier');
    expect(submitted.capacity).toEqual('16');
    expect(submitted.required_skill).toEqual('Balance / Vliegbrevet');
    expect(adminMenu.selectedMenuItem.getValue()).toEqual('shuttleView');
  });

  it('should display an error message when loading classes returns 401', () => {
    const classReq = httpMock.expectOne(r => r.headers.get('getClasses') === 'true');
    classReq.flush('YOU SHALL NOT PASS!!', { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();

    expect(component.classLoadError).toContain('401');
    expect(fixture.nativeElement.textContent).toContain('Unauthorized (401)');
  });

  it('should display an error message when loading classes returns 404', () => {
    const classReq = httpMock.expectOne(r => r.headers.get('getClasses') === 'true');
    classReq.flush('No classes', { status: 404, statusText: 'Not Found' });
    fixture.detectChanges();

    expect(component.classLoadError).toContain('404');
    expect(fixture.nativeElement.textContent).toContain('404');
  });
});
