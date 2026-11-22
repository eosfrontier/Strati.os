import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Shuttle } from '../../../shared/models/shuttle';
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
  shuttleSubscription: Subscription;
  shuttleForm: FormGroup;

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
  get type() { return this.shuttleForm.controls.type; }
  get capacity() { return this.shuttleForm.controls.capacity; }
  get base() { return this.shuttleForm.controls.base; }
  get state() { return this.shuttleForm.controls.state; }
  get status_name() { return this.shuttleForm.controls.status_name; }
  get required_skill() { return this.shuttleForm.controls.required_skill; }

  generateShuttleForm(): FormGroup {
    return new FormGroup({
      id: new FormControl(this.currentShuttle.id),
      name: new FormControl(this.currentShuttle.name || '', [Validators.required, Validators.maxLength(64)]),
      serial_number: new FormControl(this.currentShuttle.serial_number || '', [Validators.required, Validators.maxLength(32)]),
      class: new FormControl(this.currentShuttle.class || '', [Validators.required, Validators.maxLength(64)]),
      type: new FormControl(this.currentShuttle.type || '', [Validators.maxLength(64)]),
      capacity: new FormControl(this.currentShuttle.capacity || '', [Validators.min(0)]),
      base: new FormControl(this.currentShuttle.base || '', [Validators.maxLength(64)]),
      state: new FormControl(this.currentShuttle.state || '', [Validators.maxLength(64)]),
      status_name: new FormControl(this.currentShuttle.status_name || '', [Validators.maxLength(64)]),
      operable: new FormControl(this.currentShuttle.operable !== '0'),
      required_skill: new FormControl(this.currentShuttle.required_skill || '', [Validators.maxLength(64)])
    });
  }

  submitShuttle(): void {
    const shuttle = this.shuttleService.convertFormDataToShuttle(this.shuttleForm.value, this.currentShuttle);
    this.shuttleService.updateShuttle(shuttle);
    this.goBack();
  }

  goBack(): void {
    this.shuttleService.unselectShuttle();
    this.adminRouter.setSelectedMenuItem('shuttleView');
  }

  ngOnDestroy() {
    if (this.shuttleSubscription) {
      this.shuttleSubscription.unsubscribe();
    }
  }
}
