import { element } from "protractor";
import { Component, OnInit } from "@angular/core";
import { GeneralService } from "./../../service/general.service";
import { Location } from "@angular/common";
import { HelperCommon } from "./../../helper/helpercommon";
import { Router } from "@angular/router";
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: "app-shopping-cart",
  templateUrl: "./shopping-cart.component.html",
  styleUrls: ["./shopping-cart.component.css"]
})
export class ShoppingCartComponent implements OnInit {
  shoppingCartProduct = [];
  shoppingCartDetails = [];
  session = [];
  removeSelectedId: any;
  couponList = [];
  moneyTotal: number = 0;
  couponApplied: any;
  couponCheck = [];
  totalAccess: boolean = true;
  placeOrderButton: boolean = false;
  placeOrderSign: boolean = false;
  displayRemove: boolean = false;
  userInfo: any;
  cartData: any;
  loading: boolean = false;
  productInfo: any;
  addWishList: any = [];
  isDisplay: boolean = true;
  isWishList: boolean = true;
  wishlistData: any = [];
  checkWishlist: boolean;
  checkShoppingCart: any = [];
  cartAccess: boolean = false;
  couponValue: any = [];
  toggle: boolean;
  activeButtonId: any = null;
  couponName: any = [];
  couponPost: any;
  couponResult: any;
  totalAmount: any;
  coupon_type: any;
  coupon_name: any;
  bag_price: any;
  discount_type: any;
  coupon_id: any;
  quantityList: any;
  quantityValue: any = [];
  newquantityValue: any = [];
  selectQuantity: number;
  totalSum: number;
  selectQuantityData: any;
  updatedCart: any = [];
  addWishCount: number = 0;
  removeWishCount: number = 0;
  result: number = 0;
  successMessage: string;
  constructor(
    private service: GeneralService,
    private location: Location,
    private router: Router,
    public toastr: ToastrManager
  ) { }

  ngOnInit() {
    this.userInfo = HelperCommon.getUser();
    this.getWishList();
    this.getShoppingCart();
    this.shoppingCartCount();
    this.getCoupon();

    // this.updateShopingCart();
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

  /**function getShoppingCart for getting the product with auth*/
  getShoppingCart() {
    try {
      if (this.userInfo) {
        // this.loading = true;
        this.service.getCartProduct(this.userInfo["id"]).subscribe(
          resp => {
            this.loading = false;
            this.placeOrderButton = true;
            this.placeOrderSign = false;
            this.shoppingCartDetails = resp["data"]["products"];

            // updated cart
            this.service.getCart.subscribe(resp => {
              this.updatedCart = resp["data"];
              if (this.updatedCart != null) {
                if (
                  typeof this.updatedCart == "object" &&
                  this.updatedCart.hasOwnProperty("products") &&
                  !this.displayRemove
                ) {
                  if (
                    this.updatedCart["products"].length >
                    this.shoppingCartDetails.length
                  ) {
                    this.getShoppingCart();
                    this.getWishList();
                    this.checkWishlistShooping();
                  } else { }
                } else {
                  if (
                    this.updatedCart["products"].length ==
                    this.shoppingCartDetails.length &&
                    this.displayRemove
                  ) {
                  }
                }
              }
            });
            /* Quantity */

            for (let i = 0; i < this.shoppingCartDetails.length; i++) {
              this.quantityList = this.shoppingCartDetails[i][
                "available_quantity"
              ];
              if (this.shoppingCartDetails[i]["available_quantity"] > 10) {
                for (let k = 1; k <= 10; k++) {
                  this.quantityValue.push(k);
                  this.newquantityValue = new Set(this.quantityValue);
                }
              } else {
                for (let k = 1; k <= this.quantityList; k++) {
                  this.quantityValue.push(k);
                  this.newquantityValue = new Set(this.quantityValue);
                }
              }
            }
            this.couponResult = resp["data"].coupon;
            this.totalAmount = resp["data"].total_amount;
            if (resp["data"] && resp["data"].coupon != undefined) {
              this.coupon_type = resp["data"].coupon.coupon_type;
              this.coupon_name = resp["data"].coupon.coupon;
              this.bag_price = resp["data"].coupon.bag_price;
              this.discount_type = resp["data"].coupon.discount_type;
              this.coupon_id = resp["data"].coupon.coupon_id;
              if (this.couponResult != undefined) {
                this.isDisplay = true;
              }
            }
            this.session = JSON.parse(sessionStorage.getItem("session"));
            this.shoppingCartProduct = [
              ...this.shoppingCartDetails,
              ...this.session
            ];
            this.checkWishlistShooping();
            this.shoppingCartProduct.forEach((element, i) => {
              if (element == null) {
                this.shoppingCartProduct.splice(i, 1);
              } else {
                this.moneyTotal =
                  parseInt(element["selected_price"]) *
                  element["quantity_selected"] +
                  this.moneyTotal;
                this.checkWishlistShooping();
                // this.updateShopingCart();
                // element['check'] = false;
              }
            });
            if (this.shoppingCartProduct == null) {
              this.isDisplay = false;
            }
            if (this.shoppingCartProduct.length == 0) {
              this.isDisplay = false;
            }

            this.service.updateShoppingCartCount(
              this.shoppingCartProduct["length"]
            );
          },
          err => {
            this.loading = false;
            if (err.status == 400) {
              this.placeOrderButton = false;
              this.placeOrderSign = true;
            }
          }
        );
      } else {
        this.loading = false;
        this.shoppingCartProduct = JSON.parse(
          sessionStorage.getItem("session")
        );
        if (this.shoppingCartProduct != null) {
          this.service.shoppingCartUpdateCount.next(
            this.shoppingCartProduct.length
          );
        }
        if (
          (this.shoppingCartProduct && this.shoppingCartProduct.length == 0) ||
          this.shoppingCartProduct == null
        ) {
          this.cartAccess = true;
          this.isDisplay = false;
        }
        if (
          this.shoppingCartProduct &&
          this.shoppingCartProduct["length"] != null
        ) {
          this.totalSum = 0;
          for (let k = 1; k <= 10; k++) {
            this.quantityValue.push(k);
            this.newquantityValue = new Set(this.quantityValue);
          }
          this.shoppingCartProduct.filter(element => {
            this.removeSelectedId = element["shopping_cart_id"];
            this.moneyTotal =
              parseInt(element["selected_price"]) *
              element["quantity_selected"] +
              this.moneyTotal;
            this.totalSum =
              parseInt(element["selected_price"]) *
              element["quantity_selected"] +
              this.totalSum;
          });
        }
        this.placeOrderButton = false;
        this.placeOrderSign = true;
        if (this.shoppingCartProduct && this.shoppingCartProduct.length == 0) {
          this.cartAccess = true;
          this.isDisplay = false;
        }
      }
    } catch (excep) {
      console.log(excep);
    }
  }

  //   /**function addPriceList add and count the price */
  //   addPriceList() {
  //     this.shoppingCartProduct.filter(element => {
  //       this.removeSelectedId = element["shopping_cart_id"];
  //       this.moneyTotal =
  //         parseInt(element["selected_price"]) * element["quantity_selected"] +
  //         this.moneyTotal;
  //     });
  //   }
  //  /**function removePriceList remove and count the price */
  //   removePriceList() {
  //     this.shoppingCartProduct.filter(element => {
  //       this.removeSelectedId = element["shopping_cart_id"];
  //       this.moneyTotal =
  //         this.moneyTotal -
  //         parseInt(element["selected_price"]) * element["quantity_selected"];
  //     });
  //   }

  /**function shoppingCartCount for latest shopping cart count */
  shoppingCartCount() {
    this.service.updatedShoppingCart.subscribe(resp => { });
  }

  /**function removeItem for remove the item from cart */
  removeItem(data) {
    try {
      this.removeSelectedId = data;
      if (this.userInfo) {
        this.loading = true;
        this.service.removeShoppingCart(this.removeSelectedId).subscribe(
          resp => {
            this.loading = false;
            this.displayRemove = true;
            this.getShoppingCart();
            this.showToast('Removed From The Cart', 'Success!');
            // this.isDisplay=true
            //  location.reload();
          },
          err => {
            this.loading = false;
            console.log(err);
          }
        );
      } else {
        var session = sessionStorage.getItem("session")
          ? JSON.parse(sessionStorage.getItem("session"))
          : [];
        var index;
        for (var i = 0; i < session.length; i++) {
          if (session[i]["product_id"] === this.removeSelectedId) {
            index = i;
            break;
          }
        }
        if (index === undefined) return;
        session.splice(index, 1);
        sessionStorage.setItem("session", JSON.stringify(session));
        this.showToast('Removed From The Cart', 'Success!')
        this.getShoppingCart();
        //  location.reload();
      }
    } catch (excep) {
      console.log(excep);
    }
  }

  /**function getCoupon for gettinng the coupon */
  applyCouponOn(data) {
    try {
      const couponData = {
        coupon: data["coupon_name"]
      };
      //  this.loading = true;
      this.service.postCoupon(couponData).subscribe((resp: any) => {
        this.loading = false;
        this.showToast('Coupon Applied Succesfully','Success!');
        if (resp.message == "coupon applied succesfully") {
          this.couponPost = resp;
          this.toggle = true;
          this.toggle = !this.toggle;
          this.activeButtonId = data["_id"];
          this.couponApplied = data["_id"];
          this.getCoupon();
          this.getShoppingCart();
          this.getButtonText(data["_id"]);
          this.isDisplay = true;
        }
      },
        err => {
          console.log(err)
          if (err['error'] && err['error']['status'] == 400) {
            /** Notification Toaster */
            this.showToast('Selected Coupon Is Already Used... Please Try Another.', 'Warning!')
            // // this.successMsg = true;
            // this.successMessage="This Coupon Is Already Used... Please Try Another." ;
            // var x = document.getElementById("toast")
            // x.className = "show";
            // setTimeout(function(){ 
            //   x.className = x.className.replace("show", ""); 
            //   // this.successMsg = false;
            // }, 5000);
            // confirm("This Coupon Is Already Used... Please Try Another.")
            this.router.navigate(["/shopping-cart"]);

          }
        }
      );
    } catch (excep) {
      console.log(excep);
    }
  }
  /**function getButtonText for change the button name apply on coupon */
  getButtonText(id) {
    let buttonText;
    id === this.coupon_id ? (buttonText = "Applied") : (buttonText = "Apply");
    return buttonText;
  }

  /**function getCoupon for gettinng the coupon */
  getCoupon() {
    try {
      if (this.userInfo) {
        // this.loading = true;
        this.service.getCouponList().subscribe(
          resp => {
            this.loading = false;
            this.couponList = resp["data"];
            this.totalAccess = false;
            this.couponList.forEach(element => {
              if (this.couponApplied == element["_id"]) {
                this.couponCheck.push(element);
                for (let i = 0; i < this.couponCheck.length; i++) {
                  this.couponValue = this.couponCheck[i];
                }
              }
            });
          },
          err => {
            this.loading = false;
            console.log(err);
          }
        );
      }
    } catch (excep) {
      console.log(excep);
    }
  }

  /**function deleteCoupon for removing the coupon  */
  deleteCoupon() {
    try {
      this.loading = true;
      this.service.removeCoupon(this.userInfo["id"]).subscribe(
        resp => {
          this.showToast('Coupon Removed Successfully','Success!');
          this.loading = false;
          this.getShoppingCart();
          this.isDisplay = false;
          this.activeButtonId = "";
          this.coupon_type = "";
          this.coupon_id = "";
        },
        err => {
          this.loading = false;
          console.log(err);
        }
      );
    } catch (excep) {
      console.log(excep);
    }
  }
  /**function moveToPreviousLocation for move to previous location */
  moveToPreviousLocation() {
    this.location.back();
  }

  /**function productAccess for review the product again*/
  productAccess(data) {
    if (this.userInfo) {
      window.open(
        "#/product/" +
        data["sub_category_name"] +
        "/" +
        data["sub_category_id"] +
        "/" +
        "product/" +
        data["selected_products"][0]["custom_id"] +
        "/" +
        data["brand_name"]
      );
    } else {
      this.productInfo = JSON.parse(localStorage.getItem("productInform"));
      window.open(
        "#/product/" +
        this.productInfo["sub_category_name"] +
        "/" +
        this.productInfo["sub_category_id"] +
        "/" +
        "product/" +
        data["custom_id"] +
        "/" +
        this.productInfo["brand_name"]
      );
    }
  }

  /**function getWishList for getting the wishlist product*/
  getWishList() {
    try {
      this.userInfo = HelperCommon.getUser();
      if (this.userInfo) {
        // this.loading = true;
        this.service.getWishlist(this.userInfo["id"]).subscribe(
          resp => {
            this.loading = false;
            this.wishlistData = resp["data"]["products"];
            this.addWishCount = resp["data"]["products"].length;
            //  this.service.wishlistUpdateCount.next(this.addWishCount);
            if (this.wishlistData.length == 0) {
              this.isDisplay = false;
            }
          },
          error => {
            this.loading = false;
            console.log(error);
          }
        );
      }
    } catch (excep) {
      console.log(excep);
    }
  }

  /**function addToWishlist for add the product in wishlist*/
  addToWishlist(data, i) {
    this.shoppingCartProduct[i]["check"] = true;
    try {
      if (this.userInfo) {
        this.loading = true;
        const newData = {
          product_id: data._id,
          user_id: this.userInfo.id,
          custom_id: data.custom_id
        };
        this.service.postWishlist(newData).subscribe(
          resp => {
            this.checkWishlistShooping();
            this.getWishList();
            this.addWishCount = this.addWishCount + 1;
            this.result = this.addWishCount + this.removeWishCount;
            this.service.wishlistUpdateCount.next(this.addWishCount);
            this.loading = false;
            this.showToast('Added To Wishlist', 'Success!');
          },
          error => {
            this.loading = false;
            if (error.status === 400) {
              // this.router.navigate(["/login"]);
            }
            console.log(error);
          }
        );
      } else {
        this.router.navigate(["/login"]);
      }
    } catch (excep) {
      console.log(excep);
    }
  }
  /**function buttonCondition define the condition of true and false*/
  buttonCondition(obj, val) {
    if (typeof obj == "object") {
      Object.defineProperty(obj, "check", {
        value: val,
        writable: false
      });
    }
  }
  /**function checkWishlistShooping check the id of shopping cart and wishlist*/
  checkWishlistShooping() {
    for (let i in this.shoppingCartProduct) {
      for (let j in this.wishlistData) {
        if (this.shoppingCartProduct && this.shoppingCartProduct[i] != null) {
          if (
            this.wishlistData[j]["_id"] == this.shoppingCartProduct[i]["_id"]
          ) {
            this.shoppingCartProduct[i]["check"] = true;
            this.getWishList();
          }
        }
      }
    }
  }

  /**function checkWishlistActive before remove to check item in shopping cart and wishlist*/
  checkWishlistActive(data) {
    for (let i in this.shoppingCartProduct) {
      for (let j in this.wishlistData) {
        if (this.shoppingCartProduct && this.shoppingCartProduct[i] != null) {
          if (
            this.wishlistData[j]["_id"] == this.shoppingCartProduct[i]["_id"]
          ) {
            if (data["_id"] == this.shoppingCartProduct[i]["_id"]) {
              this.shoppingCartProduct[i]["check"] = false;
              this.removeWislitItem(this.wishlistData[j]["wish_list_id"]);
              // this.checkWishlistShooping();
              this.getWishList();

            }
          }
        }
      }
    }
    this.showToast('Removed From Wishlist', 'Success!')
  }

  /**function removeWislitItem for remove the item from list */
  removeWislitItem(data) {
    try {
      this.loading = true;
      this.service.removeWishlist(data).subscribe(
        resp => {
          this.loading = false;
          this.removeWishCount = -1;
          this.result = this.addWishCount + this.removeWishCount;
          this.getWishList();
          this.service.wishlistUpdateCount.next(this.result);
        },
        error => {
          console.log(error);
        }
      );
    } catch (excep) {
      this.loading = false;
      console.log(excep);
    }
  }

  /**function onOptionsSelected call the event for update quantity*/
  onOptionsSelected(data, data1) {
    this.selectQuantity = data;
    this.selectQuantityData = data1;
    this.updateShopingCart(this.selectQuantity, data1);
  }
  /**function updateShopingCart to update the quantity*/
  updateShopingCart(value, data1) {
    if (this.userInfo) {
      let temp3 = data1.shopping_cart_id;
      const data = {
        user_id: this.userInfo.id,
        product_id: data1._id,
        quantity: value,
        custom_id: data1.custom_id
      };
      this.service.updateCart(data, temp3).subscribe(
        resp => {
          this.getShoppingCart();
          this.loading = false;
        },
        error => {
          this.loading = false;
          console.log(error);
        }
      );
    } else {
      const data = {
        product_id: data1._id,
        quantity: value,
        custom_id: data1.custom_id
      };
      let sessionStore = [];
      let newValue = [];
      this.session = JSON.parse(sessionStorage.getItem("session"));
      this.session.filter(element => {
        if (
          element["shopping_cart_id"] ==
          this.selectQuantityData.shopping_cart_id
        )
          element["quantity_selected"] = data.quantity;
      });
      sessionStorage.setItem("session", JSON.stringify(this.session));
      this.getShoppingCart();
    }
  }
}
