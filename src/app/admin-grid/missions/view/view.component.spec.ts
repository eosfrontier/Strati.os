import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MissionsViewComponent } from './view.component';
import { MissionService } from '../../../shared/services/mission.service';
import { DateService } from '../../../shared/services/date.service';
import { Mission } from '../../../shared/models/mission';
import { environment } from '../../../../environments/environment';

function createMission(title: string, icdate: string, hour: number, minute: number, priority: number): Mission {
  const mission = new Mission();
  mission._id = title;
  mission.title = title;
  mission.type = 'Recon';
  mission.goal = 'Goal';
  mission.colorcode = 'blue';
  mission.icdate = icdate;
  mission.departureTime = new Date(2026, 10, 22, hour, minute, 0, 0);
  mission.priority = priority;
  return mission;
}

describe('MissionsViewComponent', () => {
  let fixture: ComponentFixture<MissionsViewComponent>;
  let missionService: MissionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MissionsViewComponent],
      providers: [DateService, MissionService]
    }).compileComponents();

    missionService = TestBed.inject(MissionService);
    httpMock = TestBed.inject(HttpTestingController);
    httpMock.match(environment.DATETIME.API_URL);
    httpMock.match(environment.MISSIONS.API_URL);

    fixture = TestBed.createComponent(MissionsViewComponent);
  });

  it('should display missions sorted by IC date then departure time with their IC date shown', () => {
    missionService.missionList.next([
      createMission('Later Day', '19.05.240NT', 8, 0, 0),
      createMission('Same Day Late', '18.05.240NT', 15, 0, 1),
      createMission('Same Day Early', '18.05.240NT', 9, 30, 5)
    ]);

    fixture.detectChanges();

    const rows: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.missions__row');
    expect(rows.length).toEqual(3);
    expect(rows[0].textContent).toContain('Same Day Early');
    expect(rows[0].textContent).toContain('18.05.240NT');
    expect(rows[0].textContent).toContain('09:30');
    expect(rows[1].textContent).toContain('Same Day Late');
    expect(rows[1].textContent).toContain('15:00');
    expect(rows[2].textContent).toContain('Later Day');
    expect(rows[2].textContent).toContain('19.05.240NT');
  });
});
