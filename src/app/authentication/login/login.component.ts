import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { AuthenticateService } from '../../service/authenticate.service';
import { GeneralService } from './../../service/general.service';
import { Router } from '@angular/router';
import { AuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { Location } from '@angular/common';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  productInfo: any;
  loginForm: FormGroup;
  confirmForm: FormGroup;
  successMsg: boolean = false;
  successMessage: string = '';
  errorMsg: boolean = false;
  errorMessage: string = '';
  user: SocialUser;
  loggedIn: boolean;
  loading: boolean = false;
  userId: number;
  mobileNumber: number;
  authenticationKey: boolean = true;
  confirmAuthentication: boolean = false;
  shoppingCartProduct = [];
  userInfo: any;
  cartData = [];
  cartDataSize = [];
  cartDataQuantity = [];
  cartDataProductId: any = [];
  productQuantity: any = [];
  customId: any = [];
  data1: any = []
  cartObj: {}
  route: string;
  constructor(private _service: AuthenticateService, private service: GeneralService, private fb: FormBuilder,
    private router: Router, private authService: AuthService, private location: Location, public toastr: ToastrManager) { }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
    this.loginValidation();
    this.confirmValidations();
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
  get signinF() {
    return this.loginForm.controls;
  }

  /**function for confirm the otp */
  get confirmF() {
    return this.confirmForm.controls;
  }

  /**validation of signup form */
  loginValidation() {
    this.loginForm = this.fb.group({
      user_name: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(8)]],
    });
  }

  /**validation of confirmForm */
  confirmValidations() {
    this.confirmForm = this.fb.group({
      otp: [""]
    })
  }

  /**loginUser for login the user */
  loginUser() {
    try {
      this.loading = true;
      this.errorMsg = false;
      if (this.loginForm.invalid) {
        return;
      }
      let apiData = this.loginForm.value,
        data = {
          user_name: apiData.user_name,
          password: apiData.password,
        };
      this.mobileNumber = data['user_name']
      this._service.loginUser(data).subscribe(resp => {
        this.userInfo = resp['data']['id']
        this.userId = resp['data']['user_id']
        this.authenticationKey = resp['is_mobile_verified']
        

        if (this.authenticationKey === true) {
          this.loading = false;
          if (resp['data']) {
            localStorage.setItem("currentUser",
              JSON.stringify({
                id: resp['data']['id'],
                name: resp['data']['name'],
                mobile: resp['data']['mobile'],
                email: resp['data']['email'],
                secretKey: resp['data']['token']
              })
            );
            localStorage.setItem('token', resp['data']['token'])
          }
          this.shoppingCartProduct = JSON.parse(sessionStorage.getItem('session'));
          if (this.shoppingCartProduct && this.shoppingCartProduct.length > 0) {
            this.shoppingCartProduct.forEach(element => {
              let temp1 = element['custom_id'];
              this.customId = temp1
              let temp2 = element['product_id'];
              this.cartDataProductId = temp2
              let temp3 = element['quantity_selected'];
              this.productQuantity = temp3
              var datax = {
                product_id: this.cartDataProductId,
                custom_id: this.customId,
                quantity: this.productQuantity,
                user_id: this.userInfo
              }
              this.data1.push(datax)
              this.cartObj = {
                "cart": this.data1
              }
            })
            this.service.addCart(this.cartObj).subscribe(resp => {
              sessionStorage.clear();
            }, error => {
              console.log(error)
            })
          }
          this.loginForm.reset();
          let changepasswordUrl = localStorage.getItem('changepasswordUrl');
          if (changepasswordUrl && changepasswordUrl == 'change-password') {
            this.router.navigate(['']);
            localStorage.removeItem('changepasswordUrl');
          }
          else {
            this.location.back();
          }

        } else {
          this.confirmAuthentication = true;
          this.authenticationKey = false;
        }
      }, error => {
        this.loading = false;
        let message = "";
        for (let prop in (error.error.errors)) {
          message += error.error.errors[prop][0] + "\n";
          this.errorMsg = true;
          this.errorMessage = message;
        }
        this.showToast(this.errorMessage, 'Error!')
      })
    } catch (excep) {
      console.log(excep)
    }
  }

  /**function confirmOtp for verify the otp */
  confirmOtp() {
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
      this.router.navigate(['/'])
    }, error => {
      this.loading = false;
      let message = "";
      for (let prop in (error.error.errors)) {
        message += error.error.errors[prop][0] + "\n";
        this.errorMsg = true;
        this.errorMessage = message;
      }
      this.showToast(this.errorMessage, 'Error!');
    })
  }

  /**function signInWithGoogle for google signin */
  signInWithGoogle(): void {
    try {
      this.loading = true;
      this.errorMsg = false;
      setTimeout(() => {
        this.loading = false;
      }, 5000);
      this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(user => {
        this.loading = false;
        let data = {
          user_id: user.id,
          name: user.name,
          email: user.email,
          mobile: user['mobile']
        }
        this._service.loginSocialGmailUser(data).subscribe(resp => {
          this.loading = false;
          if (resp['data']) {
            localStorage.setItem("currentUser",
              JSON.stringify({
                id: resp['data']['id'],
                name: resp['data']['name'],
                mobile: resp['data']['mobile'],
                email: resp['data']['email'],
                secretKey: resp['data']['token']
              })
            );
            localStorage.setItem('token', resp['data']['token'])
          }
          this.loginForm.reset();
          this.location.back();
        }, error => {
          this.loading = false;
          let message = "";
          for (let prop in (error.error.errors)) {
            message += error.error.errors[prop][0] + "\n";
            this.errorMsg = true;
            this.errorMessage = message;
          }
        })
      })
    } catch (excep) {
      console.log(excep)
    }
  }


  /**function signInWithFB for fb signin*/
  signInWithFB(): void {
    try {
      this.loading = true;
      this.errorMsg = false;
      setTimeout(() => {
        this.loading = false;
      }, 5000);
      this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(user => {
        this.loading = false;
        let data = {
          user_id: user.id,
          name: user.name,
          email: user.email,
          mobile: user['mobile']
        }
        this._service.loginSocialGmailUser(data).subscribe(resp => {
          this.loading = false;
          if (resp['data']) {
            localStorage.setItem("currentUser",
              JSON.stringify({
                id: resp['data']['id'],
                name: resp['data']['name'],
                mobile: resp['data']['mobile'],
                email: resp['data']['email'],
                secretKey: resp['data']['token']
              })
            );
            localStorage.setItem('token', resp['data']['token'])
          }
          this.loginForm.reset();
          this.location.back();
        }, error => {
          this.loading = false;
          let message = "";
          for (let prop in (error.error.errors)) {
            message += error.error.errors[prop][0] + "\n";
            this.errorMsg = true;
            this.errorMessage = message;
          }
        })
      });
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
        mobile: this.mobileNumber
      };
      this._service.ressendOtpVerify(data).subscribe(resp => {
        this.loading = false;
        // this.successMsg = true;
        this.successMessage = "Please verify your otp."
        this.showToast(this.successMessage, 'Success!');
      }, error => {
        this.loading = false;
        let message = "";
        for (let prop in (error.error.errors)) {
          message += error.error.errors[prop][0] + "\n";
          this.errorMsg = true;
          this.errorMessage = message;
        }
        this.showToast(this.errorMessage, 'Error!');
      })
    } catch (excep) {
      console.log(excep)
    }
  }
}
