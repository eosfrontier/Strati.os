import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ShuttleService } from './shuttle.service';
import { Shuttle, ShuttleClass } from '../models/shuttle';
import { MOCK_SHUTTLES } from './shuttles.mock';
import { environment } from '../../../environments/environment';

const MOCK_CLASSES: ShuttleClass[] = [
  {
    id: 1,
    name: 'AM-50 Razor interceptor',
    type: 'Scout',
    capacity: 2,
    armor: null,
    required_skill: 'Dynamic Entry',
    required_skill_id: 31162
  },
  {
    id: '2',
    name: 'Ammasarius-class multirole shuttle',
    type: 'Personnel Carrier',
    capacity: '16',
    armor: 'Resists small arms',
    required_skill: 'Balance / Vliegbrevet',
    required_skill_id: '31152'
  }
];

describe('Service: ShuttleService', () => {
  let service: ShuttleService;
  let httpMock: HttpTestingController;
  let originalShuttleToken: string;
  let originalSkillToken: string;

  beforeEach(() => {
    originalShuttleToken = environment.SHUTTLE.TOKEN;
    originalSkillToken = environment.SKILL.TOKEN;
    environment.SHUTTLE.TOKEN = 'test-orthanc-token';
    environment.SKILL.TOKEN = 'test-skill-token';

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ShuttleService]
    });

    service = TestBed.inject(ShuttleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    environment.SHUTTLE.TOKEN = originalShuttleToken;
    environment.SKILL.TOKEN = originalSkillToken;
    httpMock.verify();
  });

  it('should send token and getAll headers on GET shuttles without getClasses or id', () => {
    const req = httpMock.expectOne(environment.SHUTTLE.API_URL);
    expect(req.request.method).toEqual('GET');
    expect(req.request.headers.get('getAll')).toEqual('true');
    expect(req.request.headers.get('token')).toEqual('test-orthanc-token');
    expect(req.request.headers.has('getClasses')).toBeFalsy();
    expect(req.request.headers.has('id')).toBeFalsy();
    req.flush(JSON.stringify(MOCK_SHUTTLES));

    const list = service.shuttleList.getValue();
    expect(list.length).toEqual(MOCK_SHUTTLES.length);
    expect(list[0].name).toEqual('Ambrotos');
    expect(list[0].type).toEqual('Personnel Carrier');
    expect(list[0].capacity).toEqual('16');
    expect(list[0].base).toEqual('Bastion');
    expect(list[0].state).toEqual('Fully operational');
    expect(list[0].operable).toEqual('1');
    expect(list[0].status_name).toEqual('Ready');
    expect(list[0].status).toEqual('0');
    expect(list[0].required_skill).toEqual('Balance / Vliegbrevet');
  });

  it('should record 401 unauthorized error when loading shuttles fails', () => {
    const req = httpMock.expectOne(environment.SHUTTLE.API_URL);
    req.flush('YOU SHALL NOT PASS!!', { status: 401, statusText: 'Unauthorized' });

    expect(service.shuttleError.getValue()).toContain('401');
  });

  it('should fetch shuttle classes with getClasses and token headers only (no getAll/id)', () => {
    httpMock.expectOne(r => r.headers.get('getAll') === 'true').flush('[]');

    let result: ShuttleClass[];
    service.getShuttleClasses().subscribe(classes => {
      result = classes;
    });

    const req = httpMock.expectOne(r => r.url === environment.SHUTTLE.API_URL && r.headers.get('getClasses') === 'true');
    expect(req.request.method).toEqual('GET');
    expect(req.request.headers.get('token')).toEqual('test-orthanc-token');
    expect(req.request.headers.get('getClasses')).toEqual('true');
    expect(req.request.headers.has('getAll')).toBeFalsy();
    expect(req.request.headers.has('id')).toBeFalsy();
    req.flush(MOCK_CLASSES);

    expect(result.length).toEqual(2);
    expect(result[0].name).toEqual('AM-50 Razor interceptor');
    expect(result[1].armor).toEqual('Resists small arms');
  });

  it('should surface 401 and 404 errors from getShuttleClasses', () => {
    httpMock.expectOne(r => r.headers.get('getAll') === 'true').flush('[]');

    let status: number;
    service.getShuttleClasses().subscribe(
      () => fail('expected 401 error'),
      err => status = err.status
    );
    const req401 = httpMock.expectOne(r => r.headers.get('getClasses') === 'true');
    req401.flush('YOU SHALL NOT PASS!!', { status: 401, statusText: 'Unauthorized' });
    expect(status).toEqual(401);

    service.getShuttleClasses().subscribe(
      () => fail('expected 404 error'),
      err => status = err.status
    );
    const req404 = httpMock.expectOne(r => r.headers.get('getClasses') === 'true');
    req404.flush('Not found', { status: 404, statusText: 'Not Found' });
    expect(status).toEqual(404);
  });

  it('should fetch individual skill names via skill_id request header and cache responses', () => {
    httpMock.expectOne(r => r.headers.get('getAll') === 'true').flush('[]');

    const multiClass: ShuttleClass = {
      id: 3,
      name: 'Runner-Class',
      type: 'Fast Supply Carrier',
      capacity: 4,
      armor: null,
      required_skill: '31152, 31162',
      required_skill_id: '31152'
    };

    let names: string[];
    service.getSkillNamesForClass(multiClass).subscribe(res => names = res);

    const skillReq1 = httpMock.expectOne(r =>
      r.url === environment.SKILL.API_URL && r.headers.get('skill_id') === '31152'
    );
    expect(skillReq1.request.method).toEqual('GET');
    expect(skillReq1.request.headers.get('token')).toEqual('test-skill-token');
    expect(skillReq1.request.headers.get('skill_id')).toEqual('31152');
    expect(skillReq1.request.params.has('skill_id')).toBeFalsy();
    skillReq1.flush({ id: 31152, name: 'Vliegbrevet' });

    const skillReq2 = httpMock.expectOne(r =>
      r.url === environment.SKILL.API_URL && r.headers.get('skill_id') === '31162'
    );
    expect(skillReq2.request.method).toEqual('GET');
    expect(skillReq2.request.headers.get('token')).toEqual('test-skill-token');
    expect(skillReq2.request.headers.get('skill_id')).toEqual('31162');
    expect(skillReq2.request.params.has('skill_id')).toBeFalsy();
    skillReq2.flush([{ id: 31162, name: 'Dynamic Entry' }]);

    expect(names).toEqual(['Vliegbrevet', 'Dynamic Entry']);

    // Second call uses cached values and issues no new HTTP requests
    let cachedNames: string[];
    service.getSkillNamesForClass(multiClass).subscribe(res => cachedNames = res);
    expect(cachedNames).toEqual(['Vliegbrevet', 'Dynamic Entry']);
  });

  it('should create a shuttle via POST with token and JSON Content-Type headers and refresh the list', () => {
    httpMock.expectOne(environment.SHUTTLE.API_URL).flush('[]');

    const created = service.convertFormDataToShuttle(
      {
        name: 'Falcon',
        serial_number: 'FC-01',
        class: MOCK_CLASSES[1].name,
        base: 'Bastion',
        state: 'Fully operational',
        status_name: 'Ready',
        operable: true
      },
      undefined,
      MOCK_CLASSES[1],
      'Vliegbrevet'
    );
    expect(created.id).toBeUndefined();
    expect(created.class).toEqual('Ammasarius-class multirole shuttle');
    expect(created.class_id).toEqual('2');
    expect(created.type).toEqual('Personnel Carrier');
    expect(created.capacity).toEqual('16');
    expect(created.armor).toEqual('Resists small arms');
    expect(created.required_skill).toEqual('Vliegbrevet');
    expect(created.required_skill_id).toEqual('31152');
    expect(created.status).toEqual('0');
    expect(created.operable).toEqual('1');

    service.createNewShuttle(created);
    const postReq = httpMock.expectOne(environment.SHUTTLE.API_URL);
    expect(postReq.request.method).toEqual('POST');
    expect(postReq.request.headers.get('token')).toEqual('test-orthanc-token');
    expect(postReq.request.headers.get('Content-Type')).toEqual('application/json');
    expect(postReq.request.body.name).toEqual('Falcon');
    postReq.flush({ id: '99' });

    const refreshReq = httpMock.expectOne(environment.SHUTTLE.API_URL);
    expect(refreshReq.request.method).toEqual('GET');
    expect(refreshReq.request.headers.get('token')).toEqual('test-orthanc-token');
    refreshReq.flush(JSON.stringify([{ ...created, id: '99' }]));

    expect(service.shuttleList.getValue().length).toEqual(1);
    expect(service.shuttleList.getValue()[0].id).toEqual('99');
  });

  it('should update a shuttle via PUT with token header and update class metadata on class change', () => {
    httpMock.expectOne(environment.SHUTTLE.API_URL).flush('[]');

    const existing = new Shuttle();
    existing.id = '4';
    existing.name = 'FireBird';
    existing.serial_number = 'FH-001';
    existing.class = 'AM-50 Razor interceptor';
    existing.class_id = '1';
    existing.status = '2';
    existing.assigned_to_name = 'Sergei Konstantinova';
    existing.assigned_to_id = '99';

    const updated = service.convertFormDataToShuttle(
      {
        id: '4',
        name: 'FireBird II',
        serial_number: 'FH-002',
        class: MOCK_CLASSES[1].name,
        base: 'Fennik',
        state: 'Minor damage',
        status_name: 'On Mission',
        operable: false
      },
      existing,
      MOCK_CLASSES[1],
      'Balance / Vliegbrevet'
    );

    expect(updated.class_id).toEqual('2');
    expect(updated.type).toEqual('Personnel Carrier');
    expect(updated.capacity).toEqual('16');
    expect(updated.assigned_to_name).toEqual('Sergei Konstantinova');
    expect(updated.assigned_to_id).toEqual('99');
    expect(updated.status).toEqual('2');
    expect(updated.operable).toEqual('0');

    service.updateShuttle(updated);
    const putReq = httpMock.expectOne(`${environment.SHUTTLE.API_URL}4`);
    expect(putReq.request.method).toEqual('PUT');
    expect(putReq.request.headers.get('token')).toEqual('test-orthanc-token');
    expect(putReq.request.headers.get('Content-Type')).toEqual('application/json');
    expect(putReq.request.body.name).toEqual('FireBird II');
    putReq.flush({});

    httpMock.expectOne(environment.SHUTTLE.API_URL).flush(JSON.stringify([updated]));
    expect(service.shuttleList.getValue()[0].name).toEqual('FireBird II');
  });

  it('should delete a shuttle via DELETE, clear selection if matched, and refresh the list', () => {
    httpMock.expectOne(environment.SHUTTLE.API_URL).flush('[]');

    const shuttle = new Shuttle();
    shuttle.id = '5';
    shuttle.name = 'Ambrotos';
    service.selectShuttle(shuttle);

    service.deleteShuttle(shuttle);
    const delReq = httpMock.expectOne(`${environment.SHUTTLE.API_URL}5`);
    expect(delReq.request.method).toEqual('DELETE');
    expect(delReq.request.headers.get('token')).toEqual('test-orthanc-token');
    delReq.flush({});

    expect(service.selectedShuttle.getValue()).toBeNull();
    httpMock.expectOne(environment.SHUTTLE.API_URL).flush('[]');
    expect(service.shuttleList.getValue()).toEqual([]);
  });

  it('should omit the token header when no shuttle token is configured', () => {
    httpMock.expectOne(environment.SHUTTLE.API_URL).flush('[]');
    environment.SHUTTLE.TOKEN = '';

    const shuttle = new Shuttle();
    shuttle.id = '7';
    service.deleteShuttle(shuttle);
    const delReq = httpMock.expectOne(`${environment.SHUTTLE.API_URL}7`);
    expect(delReq.request.headers.has('token')).toBeFalsy();
    delReq.flush({});

    const refreshReq = httpMock.expectOne(environment.SHUTTLE.API_URL);
    expect(refreshReq.request.headers.has('token')).toBeFalsy();
    refreshReq.flush('[]');
  });
});
