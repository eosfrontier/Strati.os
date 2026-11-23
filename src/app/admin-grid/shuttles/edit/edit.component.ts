import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Shuttle, ShuttleClass } from '../../../shared/models/shuttle';
import { ShuttleService } from '../../../shared/services/shuttle.service';
import { AdminMenuService } from '../../admin-menu.service';
import { ValidatorService } from '../../../shared/services/form/validator.service';

@Component({
  selector: 'app-shuttle-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class ShuttlesEditComponent implements OnInit, OnDestroy {

  currentShuttle: Shuttle;
  shuttleForm: FormGroup;
  shuttleClasses: ShuttleClass[] = [];
  selectedClass: ShuttleClass = null;
  loadingClasses = false;
  classLoadError = '';
  loadingSkills = false;
  resolvedSkillDisplay = '';

  private shuttleSubscription: Subscription;
  private classesSubscription: Subscription;
  private classChangeSubscription: Subscription;
  private skillSubscription: Subscription;

  constructor(
    private shuttleService: ShuttleService,
    private adminRouter: AdminMenuService,
    private validator: ValidatorService
  ) { }

  ngOnInit() {
    this.shuttleSubscription = this.shuttleService.getSelectedShuttle().subscribe(shuttle => {
      this.currentShuttle = shuttle;
    });
    if (this.currentShuttle) {
      this.shuttleForm = this.generateShuttleForm();
      this.resolvedSkillDisplay = this.currentShuttle.required_skill || '';
      this.classChangeSubscription = this.shuttleClass.valueChanges.subscribe(className => {
        this.onClassSelected(className);
      });
      this.loadShuttleClasses();
    }
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

  get hasUnlistedCurrentClass(): boolean {
    if (!this.currentShuttle || !this.currentShuttle.class) {
      return false;
    }
    return !this.shuttleClasses.some(c => c.name === this.currentShuttle.class);
  }

  get displayType(): string {
    if (this.selectedClass) {
      return this.selectedClass.type || '-';
    }
    return this.currentShuttle && this.currentShuttle.type ? this.currentShuttle.type : '-';
  }

  get displayCapacity(): string {
    if (this.selectedClass) {
      return this.selectedClass.capacity !== null && this.selectedClass.capacity !== undefined
        ? String(this.selectedClass.capacity)
        : '-';
    }
    return this.currentShuttle && this.currentShuttle.capacity ? String(this.currentShuttle.capacity) : '-';
  }

  get displayArmor(): string {
    if (this.selectedClass) {
      return this.selectedClass.armor || 'None';
    }
    return this.currentShuttle && this.currentShuttle.armor ? this.currentShuttle.armor : 'None';
  }

  generateShuttleForm(): FormGroup {
    return new FormGroup({
      id: new FormControl(this.currentShuttle.id),
      name: new FormControl(this.currentShuttle.name || '', [Validators.required, Validators.maxLength(64)]),
      serial_number: new FormControl(this.currentShuttle.serial_number || '', [Validators.required, Validators.maxLength(32)]),
      class: new FormControl(this.currentShuttle.class || '', [Validators.required]),
      base: new FormControl(this.currentShuttle.base || '', [Validators.maxLength(64)]),
      state: new FormControl(this.currentShuttle.state || '', [Validators.maxLength(64)]),
      status_name: new FormControl(this.currentShuttle.status_name || '', [Validators.maxLength(64)]),
      operable: new FormControl(this.currentShuttle.operable !== '0')
    });
  }

  submitShuttle(): void {
    const shuttle = this.shuttleService.convertFormDataToShuttle(
      this.shuttleForm.value,
      this.currentShuttle,
      this.selectedClass,
      this.resolvedSkillDisplay
    );
    this.shuttleService.updateShuttle(shuttle);
    this.goBack();
  }

  goBack(): void {
    this.shuttleService.unselectShuttle();
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
          return;
        }
        const currentName = this.shuttleClass.value;
        const matched = this.shuttleClasses.find(c => c.name === currentName)
          || (this.currentShuttle.class_id
            ? this.shuttleClasses.find(c => String(c.id) === String(this.currentShuttle.class_id))
            : null);
        if (matched) {
          if (matched.name !== currentName) {
            this.shuttleClass.setValue(matched.name, { emitEvent: false });
          }
          this.onClassSelected(matched.name);
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
    this.loadingSkills = false;

    if (!this.selectedClass) {
      this.resolvedSkillDisplay = this.currentShuttle && this.currentShuttle.class === className
        ? (this.currentShuttle.required_skill || '')
        : '';
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
    if (this.shuttleSubscription) {
      this.shuttleSubscription.unsubscribe();
    }
    if (this.classesSubscription) {
      this.classesSubscription.unsubscribe();
    }
    if (this.classChangeSubscription) {
      this.classChangeSubscription.unsubscribe();
    }
    if (this.skillSubscription) {
      this.skillSubscription.unsubscribe();
    }
  }
}
