import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MissionService } from '../../../shared/services/mission.service';
import { DateService } from '../../../shared/services/date.service';
import { AdminMenuService } from '../../admin-menu.service';
import { ValidatorService } from '../../../shared/services/form/validator.service';

@Component({
  selector: 'app-mission-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class MissionsAddComponent implements OnInit, OnDestroy {

  constructor(
    private missionService: MissionService,
    private dateService: DateService,
    private fb: FormBuilder,
    private adminRouter: AdminMenuService,
    private validator: ValidatorService
  ) { }

  missionForm: FormGroup;

  ngOnInit() {
    this.missionForm = this.generateMissionFormGroup();
  }

  fieldCss(field: any): {} {
    return this.validator.displayFieldCss(field);
  }
  isValid(field: any): boolean {
    return this.validator.isFieldValid(field);
  }

  submitMission(): void {
    const mission = this.missionService.convertFormDataToMission(this.missionForm.value);
    this.missionService.createNewMission(mission);
    this.adminRouter.setSelectedMenuItem('adminStatus');
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
  get departureTime() { return this.missionForm.controls.departureTime; }

  generateMissionFormGroup(): FormGroup {
    const formGroup = new FormGroup({
      priority: new FormControl(9, [Validators.required, Validators.max(9), Validators.min(0)]),
      departureTime: new FormControl('00:00', [Validators.required]),
      colorcode: new FormControl('gray'),
      title: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required, Validators.maxLength(32)]),
      goal: new FormControl('', [Validators.required, Validators.maxLength(200)]),
      authorised: new FormControl(false),
      authorisedby: new FormControl(''),
      shuttle: new FormControl('none'),
      xo: new FormControl('', [Validators.required]),
    });
    return formGroup;
  }

  ngOnDestroy() {
    this.missionForm = null;
  }
}
