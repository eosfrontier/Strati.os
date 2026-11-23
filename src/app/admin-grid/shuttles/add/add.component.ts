import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ShuttleClass } from '../../../shared/models/shuttle';
import { ShuttleService } from '../../../shared/services/shuttle.service';
import { AdminMenuService } from '../../admin-menu.service';
import { ValidatorService } from '../../../shared/services/form/validator.service';

@Component({
  selector: 'app-shuttle-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class ShuttlesAddComponent implements OnInit, OnDestroy {

  shuttleForm: FormGroup;
  shuttleClasses: ShuttleClass[] = [];
  selectedClass: ShuttleClass = null;
  loadingClasses = false;
  classLoadError = '';
  loadingSkills = false;
  resolvedSkillDisplay = '';

  private classesSubscription: Subscription;
  private classChangeSubscription: Subscription;
  private skillSubscription: Subscription;

  constructor(
    private shuttleService: ShuttleService,
    private adminRouter: AdminMenuService,
    private validator: ValidatorService
  ) { }

  ngOnInit() {
    this.shuttleForm = this.generateShuttleFormGroup();
    this.classChangeSubscription = this.shuttleClass.valueChanges.subscribe(className => {
      this.onClassSelected(className);
    });
    this.loadShuttleClasses();
  }

  fieldCss(field: any): {} {
    return this.validator.displayFieldCss(field);
  }

  isValid(field: any): boolean {
    return this.validator.isFieldValid(field);
  }

  get name() { return this.shuttleForm.controls.name; }
  get serial_number() { return this.shuttleForm.controls.serial_number; }
  get shuttleClass() { return this.shuttleForm.controls.class; }
  get base() { return this.shuttleForm.controls.base; }
  get state() { return this.shuttleForm.controls.state; }
  get status_name() { return this.shuttleForm.controls.status_name; }

  generateShuttleFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(64)]),
      serial_number: new FormControl('', [Validators.required, Validators.maxLength(32)]),
      class: new FormControl('', [Validators.required]),
      base: new FormControl('Bastion', [Validators.maxLength(64)]),
      state: new FormControl('Fully operational', [Validators.maxLength(64)]),
      status_name: new FormControl('Ready', [Validators.maxLength(64)]),
      operable: new FormControl(true)
    });
  }

  submitShuttle(): void {
    const shuttle = this.shuttleService.convertFormDataToShuttle(
      this.shuttleForm.value,
      undefined,
      this.selectedClass,
      this.resolvedSkillDisplay
    );
    this.shuttleService.createNewShuttle(shuttle);
    this.adminRouter.setSelectedMenuItem('shuttleView');
  }

  goBack(): void {
    this.adminRouter.setSelectedMenuItem('shuttleView');
  }

  private loadShuttleClasses(): void {
    this.loadingClasses = true;
    this.classLoadError = '';
    this.classesSubscription = this.shuttleService.getShuttleClasses().subscribe(
      classes => {
        this.loadingClasses = false;
        this.shuttleClasses = [...classes].sort((a, b) => a.name.localeCompare(b.name));
        if (this.shuttleClasses.length === 0) {
          this.classLoadError = 'No shuttle classes found.';
        } else if (this.shuttleClass.value) {
          this.onClassSelected(this.shuttleClass.value);
        }
      },
      err => {
        this.loadingClasses = false;
        this.shuttleClasses = [];
        if (err && err.status === 401) {
          this.classLoadError = 'Unauthorized (401): invalid or missing Orthanc API token.';
        } else if (err && err.status === 404) {
          this.classLoadError = 'No shuttle classes found in Orthanc (404).';
        } else {
          this.classLoadError = 'Failed to load shuttle classes from Orthanc.';
        }
      }
    );
  }

  private onClassSelected(className: string): void {
    if (this.skillSubscription) {
      this.skillSubscription.unsubscribe();
      this.skillSubscription = null;
    }

    this.selectedClass = this.shuttleClasses.find(c => c.name === className) || null;
    this.resolvedSkillDisplay = '';
    this.loadingSkills = false;

    if (!this.selectedClass) {
      return;
    }

    const skillIds = this.shuttleService.extractSkillIds(this.selectedClass);
    if (skillIds.length === 0) {
      this.resolvedSkillDisplay = this.selectedClass.required_skill || '';
      return;
    }

    this.loadingSkills = true;
    const matchedClass = this.selectedClass;
    this.skillSubscription = this.shuttleService.getSkillNamesForClass(matchedClass).subscribe(
      names => {
        this.loadingSkills = false;
        if (names.length > 0) {
          this.resolvedSkillDisplay = names.join(', ');
        } else {
          this.resolvedSkillDisplay = matchedClass.required_skill || '';
        }
      },
      () => {
        this.loadingSkills = false;
        this.resolvedSkillDisplay = matchedClass.required_skill || '';
      }
    );
  }

  ngOnDestroy() {
    if (this.classesSubscription) {
      this.classesSubscription.unsubscribe();
    }
    if (this.classChangeSubscription) {
      this.classChangeSubscription.unsubscribe();
    }
    if (this.skillSubscription) {
      this.skillSubscription.unsubscribe();
    }
    this.shuttleForm = null;
  }
}
