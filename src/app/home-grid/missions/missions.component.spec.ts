import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MissionsComponent } from './missions.component';
import { MissionService } from '../../shared/services/mission.service';
import { DateService } from '../../shared/services/date.service';
import { Mission } from '../../shared/models/mission';
import { IcDate } from '../../shared/models/icdate';
import { environment } from '../../../environments/environment';

function createMission(title: string, icdate: string, hour: number, minute: number, priority: number): Mission {
  const mission = new Mission();
  mission._id = title;
  mission.title = title;
  mission.type = 'Recon';
  mission.xo = 'Lead';
  mission.goal = 'Goal';
  mission.authorised = true;
  mission.authorisedby = 'Cmd';
  mission.shuttle = 'none';
  mission.colorcode = 'green';
  mission.icdate = icdate;
  mission.departureTime = new Date(2026, 10, 22, hour, minute, 0, 0);
  mission.priority = priority;
  mission.delayed = false;
  mission.editcounter = 0;
  mission.creationtimestamp = 0;
  return mission;
}

describe('MissionsComponent', () => {
  let fixture: ComponentFixture<MissionsComponent>;
  let missionService: MissionService;
  let dateService: DateService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FontAwesomeModule],
      declarations: [MissionsComponent],
      providers: [DateService, MissionService]
    }).compileComponents();
  }));

  beforeEach(() => {
    dateService = TestBed.inject(DateService);
    missionService = TestBed.inject(MissionService);
    httpMock = TestBed.inject(HttpTestingController);
    httpMock.match(environment.DATETIME.API_URL);
    httpMock.match(environment.MISSIONS.API_URL);

    fixture = TestBed.createComponent(MissionsComponent);
  });

  it('should display each mission IC date and calculated day of week sorted by date then departure time', () => {
    missionService.missionList.next([
      createMission('Second Day', '19.05.240NT', 8, 0, 0),
      createMission('First Day Late', '18.05.240NT', 16, 30, 1),
      createMission('Previous Day', '17.05.240NT', 20, 0, 2),
      createMission('Legacy Undated', undefined, 7, 0, 0),
      createMission('First Day Early', '18.05.240NT', 9, 0, 9)
    ]);

    // Before the current IC date arrives from the API, show raw IC dates with no stray day label
    fixture.detectChanges();
    let rows: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.missions__entry');
    expect(Array.from(rows).map(r => r.querySelector('.ic-date').textContent.trim())).toEqual([
      '17.05.240NT',
      '18.05.240NT',
      '18.05.240NT',
      '19.05.240NT',
      '-'
    ]);

    // Once the current IC date is set (Friday 18.05.240NT), show calculated IC day of week
    const current = new IcDate();
    current.day = 18;
    current.dayName = 'fri';
    current.month = 5;
    current.monthName = 'May';
    current.year = 240;
    current.yearAfter = 'NT';
    dateService.icDate.next(current);
    fixture.detectChanges();

    rows = fixture.nativeElement.querySelectorAll('.missions__entry');
    expect(rows.length).toEqual(5);

    const titles = Array.from(rows).map(r => r.querySelector('.missions__rows').textContent.trim());
    const dates = Array.from(rows).map(r => r.querySelector('.ic-date').textContent.trim());
    const times = Array.from(rows).map(r => r.querySelector('.departure-time').textContent.trim());

    expect(titles).toEqual([
      'Previous Day',
      'First Day Early',
      'First Day Late',
      'Second Day',
      'Legacy Undated'
    ]);
    expect(dates).toEqual([
      'THU 17.05.240NT',
      'FRI 18.05.240NT',
      'FRI 18.05.240NT',
      'SAT 19.05.240NT',
      '-'
    ]);
    expect(times).toEqual([
      '20:00',
      '09:00',
      '16:30',
      '08:00',
      '07:00'
    ]);
  });
});
