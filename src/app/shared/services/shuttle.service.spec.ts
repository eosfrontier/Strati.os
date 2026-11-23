import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ShuttleService } from './shuttle.service';
import { Shuttle } from '../models/shuttle';
import { MOCK_SHUTTLES } from './shuttles.mock';
import { environment } from '../../../environments/environment';

describe('Service: ShuttleService', () => {
  let service: ShuttleService;
  let httpMock: HttpTestingController;
  let originalToken: string;

  beforeEach(() => {
    originalToken = environment.SHUTTLE.TOKEN;
    environment.SHUTTLE.TOKEN = 'test-orthanc-token';

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ShuttleService]
    });

    service = TestBed.inject(ShuttleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    environment.SHUTTLE.TOKEN = originalToken;
    httpMock.verify();
  });

  it('should parse shuttles including extended fields from Orthanc API text response', () => {
    const req = httpMock.expectOne(environment.SHUTTLE.API_URL);
    expect(req.request.method).toEqual('GET');
    expect(req.request.headers.get('getAll')).toEqual('true');
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

  it('should create a shuttle via POST and refresh the list', () => {
    httpMock.expectOne(environment.SHUTTLE.API_URL).flush('[]');

    const created = service.convertFormDataToShuttle({
      name: 'Falcon',
      serial_number: 'FC-01',
      class: 'Scout-class',
      type: 'Scout',
      capacity: 4,
      base: 'Bastion',
      state: 'Fully operational',
      status_name: 'Ready',
      operable: true,
      required_skill: 'Vliegbrevet'
    });
    expect(created.id).toBeUndefined();
    expect(created.status).toEqual('0');
    expect(created.operable).toEqual('1');

    service.createNewShuttle(created);
    const postReq = httpMock.expectOne(environment.SHUTTLE.API_URL);
    expect(postReq.request.method).toEqual('POST');
    expect(postReq.request.headers.get('token')).toEqual('test-orthanc-token');
    expect(postReq.request.body.name).toEqual('Falcon');
    postReq.flush({ id: '99' });

    const refreshReq = httpMock.expectOne(environment.SHUTTLE.API_URL);
    expect(refreshReq.request.method).toEqual('GET');
    refreshReq.flush(JSON.stringify([{ ...created, id: '99' }]));

    expect(service.shuttleList.getValue().length).toEqual(1);
    expect(service.shuttleList.getValue()[0].id).toEqual('99');
  });

  it('should update a shuttle via PUT and preserve non-edited Orthanc metadata', () => {
    httpMock.expectOne(environment.SHUTTLE.API_URL).flush('[]');

    const existing = new Shuttle();
    existing.id = '4';
    existing.name = 'FireBird';
    existing.serial_number = 'FH-001';
    existing.class = 'Runner-Class';
    existing.class_id = '3';
    existing.status = '2';
    existing.assigned_to_name = 'Sergei Konstantinova';
    existing.assigned_to_id = '99';
    existing.required_skill_id = '31152';

    const updated = service.convertFormDataToShuttle({
      id: '4',
      name: 'FireBird II',
      serial_number: 'FH-002',
      class: 'Runner-Class',
      type: 'Fast Supply Carrier',
      capacity: '4',
      base: 'Fennik',
      state: 'Minor damage',
      status_name: 'On Mission',
      operable: false,
      required_skill: 'Balance / Vliegbrevet'
    }, existing);

    expect(updated.class_id).toEqual('3');
    expect(updated.assigned_to_name).toEqual('Sergei Konstantinova');
    expect(updated.assigned_to_id).toEqual('99');
    expect(updated.required_skill_id).toEqual('31152');
    expect(updated.status).toEqual('2');
    expect(updated.operable).toEqual('0');

    service.updateShuttle(updated);
    const putReq = httpMock.expectOne(`${environment.SHUTTLE.API_URL}4`);
    expect(putReq.request.method).toEqual('PUT');
    expect(putReq.request.headers.get('token')).toEqual('test-orthanc-token');
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

    httpMock.expectOne(environment.SHUTTLE.API_URL).flush('[]');
  });
});
