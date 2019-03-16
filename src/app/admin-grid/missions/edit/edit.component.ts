import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Mission } from '../../../shared/models/mission';
import { MissionService } from '../../../shared/services/mission.service';
import { IcDate } from '../../../shared/models/icdate';
import { AdminMenuService } from '../../admin-menu.service';
import { DateService } from '../../../shared/services/date.service';
import { ValidatorService } from '../../../shared/services/form/validator.service';

@Component({
  selector: 'app-mission-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class MissionsEditComponent implements OnInit, OnDestroy {

  missionSubscription: Subscription;
  currentMission: Mission;
  missionForm: FormGroup;

  constructor(
    private missionService: MissionService,
    private fb: FormBuilder,
    private dateService: DateService,
    private adminRouter: AdminMenuService,
    private validator: ValidatorService
  ) { }

  oldDepartureTime: Date;
  delayed = false;
  showConfirmDialog = false;

  ngOnInit() {
    this.missionSubscription = this.missionService.getSelectedMission().subscribe(mission => {
      this.currentMission = mission;
      if (this.currentMission.delayed === true) {
        this.delayed = true;
      }
    });
    this.missionForm = this.generateMissionForm();
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
  get departureTime() { return this.missionForm.controls.departureTime; }

  generateMissionForm(): FormGroup {

    this.oldDepartureTime = new Date(this.currentMission.departureTime);
    const newDeparture = this.convertDateToTime(this.oldDepartureTime);

    const formGroup = new FormGroup({
      _id: new FormControl(this.currentMission._id),
      priority: new FormControl(this.currentMission.priority, [Validators.required, Validators.max(9), Validators.min(0)]),
      departureTime: new FormControl(newDeparture, [Validators.required]),
      colorcode: new FormControl(this.currentMission.colorcode),
      title: new FormControl(this.currentMission.title, [Validators.required]),
      type: new FormControl(this.currentMission.type, [Validators.required, Validators.maxLength(32)]),
      goal: new FormControl(this.currentMission.goal, [Validators.required, Validators.maxLength(200)]),
      authorised: new FormControl(this.currentMission.authorised),
      authorisedby: new FormControl(this.currentMission.authorisedby),
    });

    return formGroup;
  }

  convertDateToTime(date: Date): string {
    const oldDate = new Date(date);
    const hours = oldDate.getHours() > 9 ? oldDate.getHours() : '0' + oldDate.getHours();
    const minutes = oldDate.getMinutes() > 9 ? oldDate.getMinutes() : '0' + oldDate.getMinutes();
    return `${hours}:${minutes}`;
  }

  clickSubmit() {
    const oldTime = this.convertDateToTime(this.oldDepartureTime);
    const newTime = this.missionForm.value.departureTime;
    if (oldTime !== newTime) {
      this.showConfirmDialog = true;
    } else {
      this.submitMission(this.delayed);
    }
  }

  submitMission(delayed: boolean) {
    const mission = this.missionService.convertFormDataToMission(this.missionForm.value);
    mission.editcounter++;
    if (delayed === true) {
      mission.delayed = true;
    } else {
      mission.delayed = mission.delayed ? true : false;
      mission.departureTime = this.oldDepartureTime;
    }
    this.missionService.updateMission(mission);
    this.adminRouter.setSelectedMenuItem('missionView');
  }

  closeDialog() {
    this.showConfirmDialog = false;
  }

  ngOnDestroy() {
    this.missionSubscription.unsubscribe();
  }
}
