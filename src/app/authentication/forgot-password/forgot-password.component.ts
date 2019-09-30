import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { AuthenticateService } from '../../service/authenticate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;
  errorMsg: boolean = false;
  errorMessage: string = '';
  loading: boolean = false;


  constructor(private _service: AuthenticateService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.forgetValidations();
  }



  //get f() { return this.registerForm.controls; }
  get forgotF() {
    return this.forgotForm.controls;
  }


  /**validation of reset form */
  forgetValidations() {
    this.forgotForm = this.fb.group({
      user_name: ["", Validators.required],
    });
  }

  /**registrationUser for registration the user */
  forgetPasswordOfUser() {
    try {
      this.loading = true;
      this.errorMsg = false;
      if (this.forgotForm.invalid) {
        return;
      }
      let apiData = this.forgotForm.value,
        data = {
          user_name: apiData.user_name,
        };
      this._service.forgetUser(data).subscribe(resp => {
        sessionStorage.setItem('id', JSON.stringify({
          user_id: resp['data']['user_id']
        }))
        this.loading = false;
        this.forgotForm.reset();
        this.router.navigate(['/reset-password'])
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