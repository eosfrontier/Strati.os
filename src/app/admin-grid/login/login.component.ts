import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { ValidatorService } from '../../shared/services/form/validator.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AdminMenuService } from '../admin-menu.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  submitAttempted: boolean;

  constructor(
    private authService: AuthService,
    private validatorService: ValidatorService,
    private adminRouter: AdminMenuService
  ) { }

  ngOnInit() {
    this.submitAttempted = false;
    this.loginForm = this.generateForm();
  }

  fieldCss(field: any): {} {
    return this.validatorService.displayFieldCss(field);
  }
  isValid(field: any): boolean {
    return this.validatorService.isFieldValid(field);
  }

  get login(): AbstractControl {
    return this.loginForm.controls.login;
  }

  onSubmit(): void {
    const loginSuccess = this.authService.setAuthStatus(this.login.value);
      if (loginSuccess) {
        this.adminRouter.setSelectedMenuItem('fobView');
      } else {
        this.submitAttempted = true;
      }
  }

  private generateForm(): FormGroup {
    const formGroup = new FormGroup({
      login: new FormControl('', [Validators.required]),
    });
    return formGroup;
  }

  ngOnDestroy() { }

}
