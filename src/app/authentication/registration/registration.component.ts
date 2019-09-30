import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { AuthenticateService } from '../../service/authenticate.service';
import { MustMatch } from './../../helper/must-match.validator';
import { CommonConstants } from './../../../constant/constant';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, AfterViewInit {
  signupForm: FormGroup;
  confirmForm: FormGroup;
  successMsg: boolean = false;
  successMessage: string = '';
  errorMsg: boolean = false;
  errorMessage: string = '';
  loading: boolean = false;
  confirmScreen: boolean = false;
  signupScreen: boolean = true;
  userId: number;
  mobilenumber: number;
  verifyKey: boolean = false;
  countryCode:any="+91";
 

  constructor(private _service: AuthenticateService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.signupValidations();
    this.confirmValidations();
  }
  ngAfterViewInit() {
    this.telFieldStyles();
  }


  //get f() { return this.registerForm.controls; }
  get signupF() {
    return this.signupForm.controls;
  }

  /**function for confirm the otp */
  get confirmF() {
    return this.confirmForm.controls;
  }

  /**validation of signup form */
  signupValidations() {
    this.signupForm = this.fb.group({
      name: ["", Validators.required],
      mobile: ["", [Validators.required, Validators.pattern(CommonConstants.regexMobileNumber), Validators.minLength(10)]],
      country_code: [""],
      email: ["", Validators.pattern(CommonConstants.email)],
      password: ["", [Validators.required, Validators.minLength(8)]],
      rePassword: ["", Validators.required],
      acceptedTerms: ["", Validators.required],
    }, {
        validator: MustMatch('password', 'rePassword')
      }
    );
  }



  /**validation of confirmForm */
  confirmValidations() {
    this.confirmForm = this.fb.group({
      otp: [""]
    })
  }

/**click event of country select */
  changeCountry(e){
    if(e.target.textContent){
    // console.log(e.target.textContent)
    // console.log(e.target.textContent.split(" ").pop())
    this.countryCode = "+" + e.target.textContent.split(" ").pop()
    // console.log(this.countryCode)
    }
   }


  /**registrationUser for registration the user */
  registrationUser() {
    this.signupForm.value.country_code=this.countryCode
    //console.log(this.signupForm.value)
    try {
      this.loading = true;
      this.errorMsg = false;
      if (this.signupForm.invalid) {
        return;
      }
      let apiData = this.signupForm.value,
        data = {
          name: apiData.name,
          mobile: apiData.mobile,
          country_code: "+91",
          email: apiData.email,
          password: apiData.password,
          rePassword: apiData.password,
          acceptedTerms: apiData.acceptedTerms,
        };
      this.mobilenumber = data['mobile']
      this._service.registrationUser(data).subscribe(resp => {
        console.log(resp)
        this.confirmScreen = true;
        this.loading = false;
        this.signupScreen = false;
        this.userId = resp['data'].user_id;
      }, error => {
        if (error['error']['is_mobile_verified'] == false) {
          this.verifyKey = true;
          this.signupScreen = false;
        } else {
          this.verifyKey = false;
        }
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

  /**function confirmOtp for verify the otp */
  confirmOtp() {
    try {
      this.errorMsg = false;
      this.loading = true;
      if (this.confirmForm.invalid) {
        return;
      }
      let otpForData = this.confirmForm.value,
        data = {
          otp: otpForData.otp,
          user_id: this.userId
        };
      this._service.otpVerify(data).subscribe(resp => {
        this.loading = false;
        this.successMsg = true;
        this.successMessage = "You have successfully verify the otp.Please do Login."
        setTimeout(() => {
          this.successMsg = false;
          this.router.navigate(['/login'])
        }, 5000);
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

  /**function resendOtp for resend the otp */
  resendOtp() {
    try {
      this.errorMsg = false;
      this.loading = true;
      if (this.confirmForm.invalid) {
        return;
      }
      let data = {
        mobile: this.mobilenumber
      };
      this._service.ressendOtpVerify(data).subscribe(resp => {
        this.loading = false;
        this.successMsg = true;
        this.successMessage = "Please verify your otp."
        setTimeout(() => {
          this.successMsg = false;
        }, 5000);
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

  telFieldStyles() {
    $(".tel-field .input-group").css("margin-top", "-6px");
    $(".tel-field .input-group span").css("line-height", "40px");
    $("#exampleInputMobile .input-group").css("flex-wrap", "nowrap");
    $(".tel-field .input-group .form-control").css({ "border": "0px", "padding-left": "5px" })
  }

}
