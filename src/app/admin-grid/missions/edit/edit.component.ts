import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Mission } from '../../../shared/models/mission';
import { MissionService } from '../../../shared/services/mission.service';
import { IcDate } from '../../../shared/models/icdate';
import { AdminMenuService } from '../../admin-menu.service';
import { DateService } from '../../../shared/services/date.service';
import { ValidatorService } from '../../../shared/services/form/validator.service';
import { faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ShuttleService } from 'src/app/shared/services/shuttle.service';
import { Shuttle } from 'src/app/shared/models/shuttle';

@Component({
  selector: 'app-mission-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class MissionsEditComponent implements OnInit, OnDestroy {
  missionSubscription: Subscription;
  shuttleSubscription: Subscription;
  dateSubscription: Subscription;
  currentMission: Mission;
  shuttleList: Shuttle[];
  missionForm: FormGroup;

  faTimes = faTimes;
  faExclamationTriangle = faExclamationTriangle;

  constructor(
    private missionService: MissionService,
    private shuttleService: ShuttleService,
    private fb: FormBuilder,
    private dateService: DateService,
    private adminRouter: AdminMenuService,
    private validator: ValidatorService
  ) { }

  // showConfirmDialog = false;

  ngOnInit() {
    this.missionSubscription = this.missionService.getSelectedMission().subscribe(mission => {
      this.currentMission = mission;
    });
    this.shuttleSubscription = this.shuttleService.getShuttleList().subscribe(shuttles => {
      this.shuttleList = shuttles;
    });
    if (this.currentMission) {
      this.missionForm = this.generateMissionForm();
    }
    this.dateSubscription = this.dateService.getIcDate().subscribe(icDate => {
      if (icDate && this.missionForm) {
        const icdateControl = this.missionForm.controls.icdate;
        if (!icdateControl.dirty && !icdateControl.value) {
          icdateControl.setValue(this.dateService.formatIcDate(icDate));
        }
      }
    });
  }

  fieldCss(field: any): {} {
    return this.validator.displayFieldCss(field);
  }
  isValid(field: any): boolean {
    return this.validator.isFieldValid(field);
  }

  /**
  * @description getters for the validated input fields.
  */
  get title() { return this.missionForm.controls.title; }
  get priority() { return this.missionForm.controls.priority; }
  get goal() { return this.missionForm.controls.goal; }
  get type() { return this.missionForm.controls.type; }
  get colorcode() { return this.missionForm.controls.colorcode; }
  get xo() { return this.missionForm.controls.xo; }
  get shuttle() { return this.missionForm.controls.shuttle; }
  get icdate() { return this.missionForm.controls.icdate; }
  get departureTime() { return this.missionForm.controls.departureTime; }

  generateMissionForm(): FormGroup {
    const newDeparture = this.convertDateToTime(this.currentMission.departureTime);

    const formGroup = new FormGroup({
      _id: new FormControl(this.currentMission._id),
      priority: new FormControl(this.currentMission.priority, [Validators.required, Validators.max(9), Validators.min(0)]),
      icdate: new FormControl(this.currentMission.icdate || '', [Validators.required, this.dateService.icDateValidator()]),
      departureTime: new FormControl(newDeparture, [Validators.required]),
      colorcode: new FormControl(this.currentMission.colorcode),
      title: new FormControl(this.currentMission.title, [Validators.required]),
      type: new FormControl(this.currentMission.type, [Validators.required, Validators.maxLength(32)]),
      goal: new FormControl(this.currentMission.goal, [Validators.required, Validators.maxLength(200)]),
      authorised: new FormControl(this.currentMission.authorised),
      authorisedby: new FormControl(this.currentMission.authorisedby),
      shuttle: new FormControl(this.currentMission.shuttle),
      xo: new FormControl(this.currentMission.xo, [Validators.required]),
    });

    return formGroup;
  }

  convertDateToTime(date: Date): string {
    const oldDate = new Date(date);
    const hours = oldDate.getHours() > 9 ? oldDate.getHours() : '0' + oldDate.getHours();
    const minutes = oldDate.getMinutes() > 9 ? oldDate.getMinutes() : '0' + oldDate.getMinutes();
    return `${hours}:${minutes}`;
  }

  clickSubmit(): void {
    return this.submitMission()
  }

  submitMission(): void {
    const mission = this.missionService.convertFormDataToMission(this.missionForm.value);
    mission.editcounter = (mission.editcounter + 1);
    this.missionService.updateMission(mission);
    this.adminRouter.setSelectedMenuItem('missionView');
  }

  // closeDialog(): void {
  //   this.showConfirmDialog = false;
  // }

  ngOnDestroy() {
    if (this.missionSubscription) {
      this.missionSubscription.unsubscribe();
    }
    if (this.shuttleSubscription) {
      this.shuttleSubscription.unsubscribe();
    }
    if (this.dateSubscription) {
      this.dateSubscription.unsubscribe();
    }
  }
}
