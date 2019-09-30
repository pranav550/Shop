import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { AuthenticateService } from '../../service/authenticate.service';
import { MustMatch } from './../../helper/must-match.validator';
import { Router } from '@angular/router'
import { HelperCommon } from './../../helper/helpercommon';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changeForm: FormGroup;
  successMsg: boolean = false;
  successMessage: string = '';
  userInfo: any;
  errorMsg: boolean = false;
  errorMessage: string = ''
  loading: boolean = false;
  changepassword_location: string = '';
  constructor(private _service: AuthenticateService, private fb: FormBuilder,
    private router: Router, public toastr: ToastrManager) { }

  ngOnInit() {
    this.changeValidations();
  }

  /**function showToast for showing different type of notification*/
  showToast(data, title) {
    switch (title) {
      case "Success!": {
        this.toastr.successToastr(data, title, {
          position: 'top-right',
          toastTimeout: 2000,
          dismiss: 'click',
          animate: 'slideFromTop',
          titleClass: 'titleMsg'
        });
        break;
      }
      case "Warning!": {
        this.toastr.warningToastr(data, title, {
          position: 'top-right',
          toastTimeout: 2000,
          dismiss: 'click',
          animate: 'slideFromTop',
          titleClass: 'titleMsg'
        });
        break;
      }
      case "Error!": {
        this.toastr.errorToastr(data, title, {
          position: 'top-right',
          toastTimeout: 2000,
          dismiss: 'click',
          animate: 'slideFromTop',
          titleClass: 'titleMsg'
        });
        break;
      }
    }
  }

  //get f() { return this.registerForm.controls; }
  get resetF() {
    return this.changeForm.controls;
  }

  /**validation of signup form */
  changeValidations() {
    this.changeForm = this.fb.group({
      oldPassword: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(8)]],
      confirmPassword: ["", Validators.required],
    }, {
        validator: MustMatch('password', 'confirmPassword')
      }
    );
  }


  /**resetUser for resetUser the user password  */
  changeUserPass() {
    try {
      this.changepassword_location = "change-password";
      localStorage.setItem('changepasswordUrl', this.changepassword_location);
      this.loading = true;
      this.errorMsg = false;
      if (this.changeForm.invalid) {
        return;
      }
      this.userInfo = HelperCommon.getUser()
      let apiData = this.changeForm.value,
        data = {
          oldPassword: apiData.oldPassword,
          password: apiData.password,
          confirmPassword: apiData.confirmPassword,
        };
      this._service.changeUserPassword(data, this.userInfo.id).subscribe(resp => {
        this.loading = false;
        this.changeForm.reset();
        // this.successMsg = true;
        // this.successMessage = "You have successfully change the Password."
        this.showToast('You have successfully changed the Password.', 'Success!')
        setTimeout(() => {
          this.successMsg = false;
          this.router.navigate(['/login']);
        }, 3000);
      }, error => {
        console.log(error.error.error.error_message)
        this.loading = false;
        let errMsg = error.error.error.error_message;
        this.showToast(errMsg, 'Error');
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