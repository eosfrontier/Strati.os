import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MissionsComponent } from './missions.component';
import { MissionService } from '../../shared/services/mission.service';
import { DateService } from '../../shared/services/date.service';
import { Mission } from '../../shared/models/mission';
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
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FontAwesomeModule],
      declarations: [MissionsComponent],
      providers: [DateService, MissionService]
    }).compileComponents();

    missionService = TestBed.inject(MissionService);
    httpMock = TestBed.inject(HttpTestingController);
    httpMock.match(environment.DATETIME.API_URL);
    httpMock.match(environment.MISSIONS.API_URL);

    fixture = TestBed.createComponent(MissionsComponent);
  });

  it('should display each mission IC date sorted by date then departure time', () => {
    missionService.missionList.next([
      createMission('Second Day', '19.05.240NT', 8, 0, 0),
      createMission('First Day Late', '18.05.240NT', 16, 30, 1),
      createMission('Legacy Undated', undefined, 7, 0, 0),
      createMission('First Day Early', '18.05.240NT', 9, 0, 9)
    ]);

    fixture.detectChanges();

    const rows: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.missions__entry');
    expect(rows.length).toEqual(4);

    const titles = Array.from(rows).map(r => r.querySelector('.missions__rows').textContent.trim());
    const dates = Array.from(rows).map(r => r.querySelector('.ic-date').textContent.trim());
    const times = Array.from(rows).map(r => r.querySelector('.departure-time').textContent.trim());

    expect(titles).toEqual([
      'First Day Early',
      'First Day Late',
      'Second Day',
      'Legacy Undated'
    ]);
    expect(dates).toEqual([
      '18.05.240NT',
      '18.05.240NT',
      '19.05.240NT',
      '-'
    ]);
    expect(times).toEqual([
      '09:00',
      '16:30',
      '08:00',
      '07:00'
    ]);
  });
});
