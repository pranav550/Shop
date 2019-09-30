import { Coupons } from './../../models/coupons';
import { Component, OnInit } from '@angular/core';
import { HelperCommon } from './../../helper/helpercommon';
import { GeneralService } from './../../service/general.service';
import { FormGroup, Validators, FormBuilder, FormControl } from "@angular/forms";
import { CommonConstants } from './../../../constant/constant';
import { Router } from '@angular/router';
import moment from 'moment';
import { element } from '@angular/core/src/render3';
import { ToastrManager } from 'ng6-toastr-notifications';

declare var $: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  userInfo: any;
  addressInfo = [];
  selected: any;
  userAddress: any;
  shoppingCart = [];
  shoppingdetail: any;
  checkoutForm: FormGroup;
  stripeObj: any;
  orderProduct = [];
  successmsg: boolean = true;
  shoppingkey: boolean = false;
  orderKey: any;
  loading: boolean = false;
  shoppingCartProduct = [];
  addressForm: FormGroup;
  updateForm: FormGroup;
  stateList: any;
  selectedState: string = 'Andhra Pradesh';
  successMsg: boolean = false;
  successMessage: string = '';
  successMsg1: boolean = false;
  successMessage1: string = '';
  addressId: any;
  bag_price: any;
  useraddressId: any = [];
  cashbackAmount: any;
  proceedButton:boolean=true;
  constructor(private service: GeneralService, private fb: FormBuilder,
   private router: Router, private toastr:ToastrManager) { }

  ngOnInit() {
    this.getAddress();
    this.getShoppingCart();
    this.checkoutValidations();
    this.addressValidations();
    this.getUserState();
    this.updateForm = this.fb.group({
      'name': new FormControl('', Validators.required),
      'contact': new FormControl('', Validators.required),
      'address_type': new FormControl('', Validators.required),
      'address_line_1': new FormControl('', Validators.required),
      'building_name': new FormControl('', Validators.required),
      'street': new FormControl('', Validators.required),
      'landmark': new FormControl('', Validators.required),
      'city': new FormControl('', Validators.required),
      'state': new FormControl('', Validators.required),
      'pincode': new FormControl('', Validators.required),
      'default_address': new FormControl(1, Validators.required),
    });
    $(document).ready(function () {
      /**function for showing filled steps*/
      $("#checkoutTabs li a").click(function () {
        $(this).parent().prev().addClass('filled');
        $(this).parent().addClass('filled');
      });
    });
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

  /**function getAddress for getting the address */
  // getAddress() {
  //   this.userInfo = HelperCommon.getUser();
  //   this.service.getUserAddress(this.userInfo['id']).subscribe(resp => {
  //     this.addressInfo = resp['data']
  //   })
  // }


  /**function onSelectionChange for change*/
  onSelectionChange(data) {
    this.userAddress = data
  }

  /**function getShoppingCart for getting the product*/
  getShoppingCart() {
    this.service.getCartProduct(this.userInfo['id']).subscribe(resp => {
      this.shoppingdetail = resp['data']['total_amount']
      this.shoppingCart = resp['data']['products'];
     if(resp['data'].coupon){
       this.bag_price= resp['data'].coupon.bag_price;
       this.cashbackAmount= resp['data'].coupon
       }
      if (this.bag_price !== undefined || resp['data'].coupon) {
        this.bag_price = resp['data'].coupon.bag_price;
        this.cashbackAmount = resp['data'].coupon.cashback_amount
      }
      this.shoppingCartProduct = resp['data']['products']
      // this.shoppingCart.forEach(element => {
      //   this.orderProduct.push(element['product_id'])
      // })
    })
  }

  //get f() { return this.registerForm.controls; }
  get checkoutF() {
    return this.checkoutForm.controls;
  }

  /**validation of checkout form */
  checkoutValidations() {
    this.checkoutForm = this.fb.group({
      cardName: ["", [Validators.required]],
      cardNumber: ["", [Validators.required, Validators.pattern(CommonConstants.stripeCardNmuber)]],
      cvc: ["", [Validators.required, Validators.pattern(CommonConstants.cvcPattern)]],
      expiryMonth: ["", [Validators.required, Validators.pattern(CommonConstants.expiryMonthPattern)]],
      expiryYear: ["", [Validators.required, Validators.pattern(CommonConstants.epiryYearPattern)]],
    }
    );
  }

  /**function checkoutUser for checkout the user */
  checkoutUser(data, amount) {
    try {
      // this.loading = true;
      this.stripeObj = data;
      (<any>window).Stripe.card.createToken({
        name: this.stripeObj.cardName.value,
        number: this.stripeObj.cardNumber.value,
        exp_month: this.stripeObj.expiryMonth.value,
        exp_year: this.stripeObj.expiryYear.value,
        cvc: this.stripeObj.cvc.value
      }, amount * 100, (status: number, response: any) => {
        if (status === 200) {
          let payObj = {
            stripeToken: response['id'],
            product: this.shoppingCartProduct,
            ordered_at: moment().format("DD-MM-YYYY"),
            address_id: this.useraddressId

          }
          this.service.postPayment(payObj).subscribe(resp => {
            this.loading = false;
            this.orderKey = resp['data']['order_id']
            this.successmsg = false;
            this.shoppingkey = true;
          }, error => {
            this.loading = false;
            console.log(error)
          })
        }
      }
      )
    } catch (excep) {
      console.log(excep)
    }
  }

  /**function moveToDashboard for moving the dashboard after successfull order */
  moveToDashboard() {
    // location.reload();
    this.router.navigate(['/']);
  }

  /**function nextTab for moving to next tab and enabling it */
  nextTab() {
    var tabs = $('.nav-pills .active').parent('li').next('li');
    $(tabs).find('a').trigger('click');
    $(tabs).removeClass('disabledTab');
    // 
  }

  screenResize(){
    document.getElementsByTagName("body")[0].click();
  }



  /** function for navigation the scroll the new address section */
  scrollNavigate() {
    this.successMsg = false;
    this.successMsg1 = false;
    event.preventDefault();
    var expanded = $($(".scrollLink").attr("href")).hasClass("show");
    if (!expanded) {
      $("html, body").animate({
        scrollTop: $($(".scrollLink").attr("href")).prev().offset().top - 38
      }, 500);
    }
  }

  /**function getAddress for getting the address */
  getAddress() {
    try {
      this.userInfo = HelperCommon.getUser();
      if (this.userInfo) {
        this.loading = false;
        this.service.getUserAddress(this.userInfo['id']).subscribe(resp => {
          this.loading = false;
          this.addressInfo = resp['data']
          this.addressInfo.forEach(element => {
            if (element.default_address == true)
              this.useraddressId = element._id
          })
          if(this.addressInfo.length==0){
            this.proceedButton=false
          }
        }, error => {
          console.log(error)
        })
      }
    } catch (excep) {
      console.log(excep)
    }
  }

  /**function getUserState for getting the states list */
  getUserState() {
    this.service.getStates().subscribe(resp => {
      this.stateList = resp['data'][0]['state'];
    })
  }

  //get f() { return this.addressF.controls; }
  get addressF() {
    return this.addressForm.controls;
  }

  //get for update the formcontrol
  get updateAddressF() {
    return this.updateForm.controls;
  }


  /**validation of signup form */
  addressValidations() {
    this.addressForm = this.fb.group({
      name: ["", Validators.required],
      city: ["", Validators.required],
      street: ["", Validators.required],
      pincode: ["", [Validators.required, Validators.pattern(CommonConstants.pinCodeRegex)]],
      address_line_1: ["", Validators.required],
      state: this.selectedState == '' ? this.selectedState : this.selectedState,
      contact: ["", [Validators.required, Validators.pattern(CommonConstants.regexMobileNumber), Validators.minLength(10)]],
      address_type: ["", Validators.required],
      building_name: ["", Validators.required],
      landmark: ["", Validators.required],
      default_address: ["1", Validators.required]
    });
  }

  /**function onChange for select the state*/
  onChange(data) {
    this.selectedState = data
    this.addressForm.controls.state.setValue(this.selectedState);
  }

  /**function removeAddress for remove the address from list */
  removeAddress(data) {
    try {
      this.loading = true;
      this.successMsg = false;
      this.service.removeUserAddress(data).subscribe(resp => {
        this.loading = false;
        this.successMsg1 = true;
        // this.successMessage1 = "You have successfully deleted the address."
        this.showToast('Selected Address Removed','Success!')
        this.getAddress();
        setTimeout(() => {
          this.successMsg1 = false;
        }, 5000);
      }, error => {
        this.loading = false;
        console.log(error)
      })
    } catch (excep) {
      console.log(excep);
    }
  }

  /**function addAddressUser for add the address */
  addAddressUser() {
    console.log("check")
    try {
      // this.addressAccessForEdit = false;
      // this.addressAccess = true;
      this.loading = true;
      let data = this.addressForm.value;
      this.service.addAddress(data).subscribe(resp => {
        console.log(resp)
        this.loading = false;
        this.addressForm.reset();
        this.successMsg = true;
        this.getAddress();
        // this.successMessage = "You have successfully added the address."
        this.showToast('New Address Added Successfully','Success!')
        setTimeout(() => {
          this.successMsg = false;
        }, 5000);
      }, error => {
        this.loading = false;
        console.log(error)
      })
    } catch (excep) {
      console.log(excep)
    }
  }

  /**function editAddress for get the data based on id */
  editAddress(itemId) {
    try {
      // this.addressAccess = false;
      // this.addressAccessForEdit = true;
      this.loading = true;
      this.userInfo = HelperCommon.getUser();
      this.scrollNavigate();
      this.service.getUserAddressIndivdual(this.userInfo['id'], itemId).subscribe(resp => {
        this.loading = false;
        this.userAddress = resp['data'][0];
        this.proceedButton=false;
        this.addressId = this.userAddress['_id']
        this.updateForm.controls.name.setValue(this.userAddress['name']),
          this.updateForm.controls.contact.setValue(this.userAddress['contact']),
          this.updateForm.controls.address_type.setValue(this.userAddress['address_type']),
          this.updateForm.controls.address_line_1.setValue(this.userAddress['address_line_1']),
          this.updateForm.controls.building_name.setValue(this.userAddress['building_name']),
          this.updateForm.controls.street.setValue(this.userAddress['street']),
          this.updateForm.controls.landmark.setValue(this.userAddress['landmark']),
          this.updateForm.controls.city.setValue(this.userAddress['city']),
          this.updateForm.controls.state.setValue(this.userAddress['state_id']),
          this.updateForm.controls.pincode.setValue(this.userAddress['pincode'])
      }, error => {
        this.loading = false;
        console.log(error);
      })
    } catch (excep) {
      console.log(excep)
    }
  }

  /**function updateUserAddress for update the user address */
  updateUserAddress() {
    try {
      this.loading = true;
      this.successMsg = false;
      let data = {
        name: this.updateForm.controls.name.value,
        contact: this.updateForm.controls.contact.value,
        address_type: this.updateForm.controls.address_type.value,
        address_line_1: this.updateForm.controls.address_line_1.value,
        building_name: this.updateForm.controls.building_name.value,
        street: this.updateForm.controls.street.value,
        landmark: this.updateForm.controls.landmark.value,
        city: this.updateForm.controls.city.value,
        state: this.selectedState,
        pincode: this.updateForm.controls.pincode.value,
        default_address: '1'
      }
      this.service.updateUserAddress(this.addressId, data).subscribe(resp => {
        this.loading = false;
        this.successMsg = true;
        this.getAddress();
        // this.successMessage = "You have successfully updated the Address."
        this.showToast('Address Updated Successfully','Success!')
        setTimeout(() => {
          this.successMsg = false;
        }, 5000);
      }, error => {
        this.loading = false;
        console.log(error)
      })
    } catch (excep) {
      console.log(excep)
    }
  }
  editFormSubmitted() {
    $('.edit-rmv-container>.scrollLink').trigger('click');
    this.proceedButton= true;
  }
  addressFormSubmitted() {
    $('.new-address').trigger('click');
    this.proceedButton= true;
  }

}

