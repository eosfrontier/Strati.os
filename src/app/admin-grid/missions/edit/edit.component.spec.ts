import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrderModule } from 'ngx-order-pipe';
import { MissionsEditComponent } from './edit.component';
import { FormErrorFieldComponent } from '../../../shared/components/form-error-field/form-error-field.component';
import { DateService } from '../../../shared/services/date.service';
import { MissionService } from '../../../shared/services/mission.service';
import { ShuttleService } from '../../../shared/services/shuttle.service';
import { IcDate } from '../../../shared/models/icdate';
import { Mission } from '../../../shared/models/mission';
import { environment } from '../../../../environments/environment';

describe('MissionsEditComponent', () => {
  let component: MissionsEditComponent;
  let fixture: ComponentFixture<MissionsEditComponent>;
  let dateService: DateService;
  let missionService: MissionService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, FontAwesomeModule, OrderModule],
      declarations: [MissionsEditComponent, FormErrorFieldComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    dateService = TestBed.inject(DateService);
    missionService = TestBed.inject(MissionService);
    TestBed.inject(ShuttleService);
    httpMock = TestBed.inject(HttpTestingController);
    httpMock.match(environment.DATETIME.API_URL);
    httpMock.match(environment.MISSIONS.API_URL);
    httpMock.match(environment.SHUTTLE.API_URL);
  });

  function buildMission(icdate?: string): Mission {
    const mission = new Mission();
    mission._id = 'm1';
    mission.title = 'Recon Alpha';
    mission.priority = 3;
    mission.icdate = icdate;
    mission.departureTime = new Date(2026, 10, 22, 10, 45, 0, 0);
    mission.colorcode = 'blue';
    mission.type = 'Recon';
    mission.goal = 'Check northern sector';
    mission.authorised = true;
    mission.authorisedby = 'Cmdr';
    mission.shuttle = 'none';
    mission.xo = 'Lead';
    mission.delayed = false;
    mission.editcounter = 0;
    return mission;
  }

  it('should preserve existing mission icdate instead of overwriting with current IC date', () => {
    const current = new IcDate();
    current.day = 20;
    current.month = 5;
    current.year = 240;
    current.yearAfter = 'NT';
    dateService.icDate.next(current);

    missionService.selectMission(buildMission('17.05.240NT'));

    fixture = TestBed.createComponent(MissionsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.icdate.value).toEqual('17.05.240NT');
  });

  it('should default icdate from DateService when editing a legacy mission with no icdate', () => {
    const current = new IcDate();
    current.day = 18;
    current.month = 5;
    current.year = 240;
    current.yearAfter = 'NT';
    dateService.icDate.next(current);

    missionService.selectMission(buildMission(undefined));

    fixture = TestBed.createComponent(MissionsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.icdate.value).toEqual('18.05.240NT');
  });
});
