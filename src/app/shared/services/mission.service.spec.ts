import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MissionService } from './mission.service';
import { DateService } from './date.service';
import { IcDate } from '../models/icdate';
import { Mission } from '../models/mission';
import { environment } from '../../../environments/environment';

function buildMission(overrides: Partial<Mission>): Mission {
  const mission = new Mission();
  mission._id = overrides._id || 'id';
  mission.title = overrides.title || 'Mission';
  mission.priority = overrides.priority !== undefined ? overrides.priority : 5;
  mission.type = overrides.type || 'Recon';
  mission.goal = overrides.goal || 'Scout area';
  mission.colorcode = overrides.colorcode || 'gray';
  mission.authorised = overrides.authorised !== undefined ? overrides.authorised : true;
  mission.authorisedby = overrides.authorisedby || 'Command';
  mission.xo = overrides.xo || 'Commander';
  mission.icdate = overrides.icdate;
  mission.shuttle = overrides.shuttle || 'none';
  mission.departureTime = overrides.departureTime;
  mission.delayed = false;
  mission.editcounter = 0;
  mission.creationtimestamp = 0;
  return mission;
}

function localTime(year: number, month: number, day: number, hours: number, minutes: number): Date {
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

describe('Service: MissionService', () => {
  let service: MissionService;
  let dateService: DateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DateService, MissionService]
    });

    dateService = TestBed.inject(DateService);
    service = TestBed.inject(MissionService);
    httpMock = TestBed.inject(HttpTestingController);

    httpMock.match(environment.DATETIME.API_URL);
    httpMock.match(environment.MISSIONS.API_URL);
  });

  it('should attach and normalize icdate when converting form data', () => {
    const mission = service.convertFormDataToMission({
      priority: 3,
      icdate: '5.5.240nt',
      departureTime: '14:30',
      colorcode: 'blue',
      title: 'Operation Skyjack',
      type: 'Combat',
      goal: 'Secure ridge',
      authorised: true,
      authorisedby: 'Cmdr',
      shuttle: 'none',
      xo: 'Lead'
    });

    expect(mission.icdate).toEqual('05.05.240NT');
    expect(mission.departureTime.getHours()).toEqual(14);
    expect(mission.departureTime.getMinutes()).toEqual(30);
  });

  it('should default icdate from DateService when omitted from form data', () => {
    const current = new IcDate();
    current.day = 18;
    current.month = 5;
    current.year = 240;
    current.yearAfter = 'NT';
    dateService.icDate.next(current);

    const mission = service.convertFormDataToMission({
      priority: 1,
      departureTime: '09:15',
      colorcode: 'green',
      title: 'Morning Patrol',
      type: 'Patrol',
      goal: 'Check perimeter',
      authorised: false,
      authorisedby: '',
      shuttle: 'none',
      xo: 'Lead'
    });

    expect(mission.icdate).toEqual('18.05.240NT');
  });

  it('should sort missions by IC date, then departure time of day, then priority without mutating input', () => {
    const mYearRollover = buildMission({
      title: 'New Year',
      icdate: '01.01.241NT',
      departureTime: localTime(2026, 11, 20, 6, 0),
      priority: 0
    });
    const mNextDayEarly = buildMission({
      title: 'Next Day Early',
      icdate: '19.05.240NT',
      departureTime: localTime(2026, 11, 20, 8, 0),
      priority: 1
    });
    const mSameDayLate = buildMission({
      title: 'Same Day Late',
      icdate: '18.05.240NT',
      departureTime: localTime(2026, 11, 20, 14, 30),
      priority: 1
    });
    const mSameDayEarlyEditedNextOcDay = buildMission({
      title: 'Same Day Early',
      icdate: '18.05.240NT',
      // Newer OC date portion (Nov 25) should not defeat earlier time-of-day (09:15)
      departureTime: localTime(2026, 11, 25, 9, 15),
      priority: 9
    });
    const mSameDayTieLowPriority = buildMission({
      title: 'Tie P5',
      icdate: '18.05.240NT',
      departureTime: localTime(2026, 11, 20, 9, 15),
      priority: 5
    });
    const mUnpaddedEarly = buildMission({
      title: 'Earlier Unpadded',
      icdate: '9.5.240NT',
      departureTime: localTime(2026, 11, 22, 22, 0),
      priority: 9
    });
    const mNoDateLate = buildMission({
      title: 'Legacy Late',
      icdate: undefined,
      departureTime: localTime(2026, 11, 20, 12, 0),
      priority: 1
    });
    const mNoDateEarly = buildMission({
      title: 'Legacy Early',
      icdate: '',
      departureTime: localTime(2026, 11, 20, 7, 0),
      priority: 2
    });

    const input = [
      mNoDateLate,
      mYearRollover,
      mSameDayLate,
      mSameDayEarlyEditedNextOcDay,
      mNextDayEarly,
      mNoDateEarly,
      mUnpaddedEarly,
      mSameDayTieLowPriority
    ];
    const snapshot = [...input];

    const sorted = service.sortMissions(input);

    expect(input).toEqual(snapshot);
    expect(sorted.map(m => m.title)).toEqual([
      'Earlier Unpadded',
      'Tie P5',
      'Same Day Early',
      'Same Day Late',
      'Next Day Early',
      'New Year',
      'Legacy Early',
      'Legacy Late'
    ]);
  });

  it('should handle null or empty mission lists safely', () => {
    expect(service.sortMissions(null)).toBeNull();
    expect(service.sortMissions([])).toEqual([]);
  });
});
