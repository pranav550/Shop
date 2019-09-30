import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { AuthenticateService } from '../../service/authenticate.service';
import { MustMatch } from './../../helper/must-match.validator';
import { Router } from '@angular/router'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  successMsg: boolean = false;
  successMessage: string = '';
  errorMsg: boolean = false;
  errorMessage: string = '';
  loading: boolean = false;
  session: any;

  constructor(private _service: AuthenticateService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.resetValidations();
    this.session = JSON.parse(sessionStorage.getItem('id'))
  }

  //get f() { return this.registerForm.controls; }
  get resetF() {
    return this.resetForm.controls;
  }

  /**validation of signup form */
  resetValidations() {
    this.resetForm = this.fb.group({
      otp: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(8)]],
      rePassword: ["", Validators.required],
    }, {
        validator: MustMatch('password', 'rePassword')
      }
    );
  }


  /**resetUser for resetUser the user password  */
  resetUser() {
    try {
      this.loading = true;
      this.errorMsg = false;
      if (this.resetForm.invalid) {
        return;
      }
      let apiData = this.resetForm.value,
        data = {
          user_id: this.session['user_id'],
          otp: apiData.otp,
          password: apiData.password,
          rePassword: apiData.password,
        };
      this._service.resetUser(data).subscribe(resp => {
        this.loading = false;
        this.resetForm.reset();
        this.successMsg = true;
        this.successMessage = "You have successfully updated the Password."
        setTimeout(() => {
          this.successMsg = false;
          this.router.navigate(['/login']);
        }, 7000);
      }, error => {
        this.loading = false;
        let message = "";
        for (let prop in (error.error.errors)) {
          message += error.error.errors[prop][0] + "\n";
          this.errorMsg = true;
          this.errorMessage = message;
        }
      })
    } catch (excep) {
      console.log(excep)
    }
  }
}
