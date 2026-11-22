import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';
import { MissionsAddComponent } from './add.component';
import { FormErrorFieldComponent } from '../../../shared/components/form-error-field/form-error-field.component';
import { DateService } from '../../../shared/services/date.service';
import { MissionService } from '../../../shared/services/mission.service';
import { ShuttleService } from '../../../shared/services/shuttle.service';
import { IcDate } from '../../../shared/models/icdate';
import { environment } from '../../../../environments/environment';

describe('MissionsAddComponent', () => {
  let component: MissionsAddComponent;
  let fixture: ComponentFixture<MissionsAddComponent>;
  let dateService: DateService;
  let missionService: MissionService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, OrderModule],
      declarations: [MissionsAddComponent, FormErrorFieldComponent]
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

    fixture = TestBed.createComponent(MissionsAddComponent);
    component = fixture.componentInstance;
  });

  it('should pre-fill icdate from DateService without overwriting manual edits', () => {
    fixture.detectChanges();
    expect(component.icdate.value).toEqual('');

    const apiDate = new IcDate();
    apiDate.day = 18;
    apiDate.month = 5;
    apiDate.year = 240;
    apiDate.yearAfter = 'NT';
    dateService.icDate.next(apiDate);

    expect(component.icdate.value).toEqual('18.05.240NT');
    expect(component.icdate.valid).toBeTruthy();

    component.icdate.setValue('19.05.240NT');
    component.icdate.markAsDirty();

    const laterDate = new IcDate();
    laterDate.day = 20;
    laterDate.month = 5;
    laterDate.year = 240;
    laterDate.yearAfter = 'NT';
    dateService.icDate.next(laterDate);

    expect(component.icdate.value).toEqual('19.05.240NT');
  });

  it('should reject invalid icdate format and submit normalized icdate when valid', () => {
    fixture.detectChanges();
    spyOn(missionService, 'createNewMission');

    component.missionForm.patchValue({
      title: 'Operation Skyjack',
      icdate: 'not-a-date',
      departureTime: '14:30',
      priority: 2,
      type: 'Combat',
      goal: 'Secure ridge',
      xo: 'Lead'
    });
    expect(component.missionForm.valid).toBeFalsy();

    component.icdate.setValue('5.5.240nt');
    expect(component.missionForm.valid).toBeTruthy();

    component.submitMission();
    expect(missionService.createNewMission).toHaveBeenCalled();
    const submitted = (missionService.createNewMission as jasmine.Spy).calls.mostRecent().args[0];
    expect(submitted.icdate).toEqual('05.05.240NT');
  });
});
