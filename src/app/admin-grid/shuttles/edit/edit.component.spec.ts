import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ShuttlesEditComponent } from './edit.component';
import { FormErrorFieldComponent } from '../../../shared/components/form-error-field/form-error-field.component';
import { ShuttleService } from '../../../shared/services/shuttle.service';
import { AdminMenuService } from '../../admin-menu.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Shuttle, ShuttleClass } from '../../../shared/models/shuttle';
import { environment } from '../../../../environments/environment';

const MOCK_CLASSES: ShuttleClass[] = [
  {
    id: 3,
    name: 'Runner-Class',
    type: 'Fast Supply Carrier',
    capacity: 2,
    armor: null,
    required_skill: '31152',
    required_skill_id: 31152
  },
  {
    id: 2,
    name: 'Ammasarius-class multirole shuttle',
    type: 'Personnel Carrier',
    capacity: 16,
    armor: 'Resists small arms',
    required_skill: '31152, 31162',
    required_skill_id: '31152, 31162'
  }
];

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
    httpMock.match(r => r.url === environment.SHUTTLE.API_URL && r.headers.get('getAll') === 'true');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should populate class dropdown, resolve skill names on load/change, and save updated shuttle', () => {
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

    const classReq = httpMock.expectOne(r => r.headers.get('getClasses') === 'true');
    classReq.flush(MOCK_CLASSES);

    const initSkillReq = httpMock.expectOne(r =>
      r.url === environment.SKILL.API_URL && r.params.get('skill_id') === '31152'
    );
    initSkillReq.flush({ id: 31152, name: 'Vliegbrevet' });
    fixture.detectChanges();

    expect(component.name.value).toEqual('FireBird');
    expect(component.shuttleClass.value).toEqual('Runner-Class');
    expect(fixture.nativeElement.querySelector('.class-stats__skill').textContent.trim()).toEqual('Vliegbrevet');
    expect(fixture.nativeElement.querySelector('input#type')).toBeNull();
    expect(fixture.nativeElement.querySelector('input#capacity')).toBeNull();
    expect(fixture.nativeElement.querySelector('input#required_skill')).toBeNull();

    // Switch to another class whose required skills are 31152 and 31162 (31152 already cached)
    component.shuttleForm.patchValue({
      class: 'Ammasarius-class multirole shuttle',
      state: 'Under maintenance',
      status_name: 'Ready',
      operable: false
    });

    const extraSkillReq = httpMock.expectOne(r =>
      r.url === environment.SKILL.API_URL && r.params.get('skill_id') === '31162'
    );
    extraSkillReq.flush({ id: 31162, name: 'Dynamic Entry' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.class-stats__type').textContent.trim()).toEqual('Personnel Carrier');
    expect(fixture.nativeElement.querySelector('.class-stats__capacity').textContent.trim()).toEqual('16');
    expect(fixture.nativeElement.querySelector('.class-stats__armor').textContent.trim()).toEqual('Resists small arms');
    expect(fixture.nativeElement.querySelector('.class-stats__skill').textContent.trim()).toEqual('Vliegbrevet, Dynamic Entry');

    spyOn(shuttleService, 'updateShuttle');
    component.submitShuttle();

    expect(shuttleService.updateShuttle).toHaveBeenCalled();
    const updated = (shuttleService.updateShuttle as jasmine.Spy).calls.mostRecent().args[0];
    expect(updated.id).toEqual('4');
    expect(updated.class).toEqual('Ammasarius-class multirole shuttle');
    expect(updated.class_id).toEqual('2');
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
