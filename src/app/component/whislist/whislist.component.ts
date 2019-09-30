import { Component, OnInit } from "@angular/core";
import { GeneralService } from "./../../service/general.service";
import { Location } from "@angular/common";
import { HelperCommon } from "./../../helper/helpercommon";
import { Router } from "@angular/router";
declare var $: any;

@Component({
  selector: "app-whislist",
  templateUrl: "./whislist.component.html",
  styleUrls: ["./whislist.component.css"]
})
export class WhislistComponent implements OnInit {
  wishlistData = [];
  userInfo: any;
  loading: boolean = false;
  isDisplay: boolean = true;
  wishListSelectedItem: any;
  cartArray:any = []
  dataObj: any = {}
  constructor(
    private service: GeneralService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    this.getWishList();
    this.wishlistCount();
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
            this.service.updateWishlistCount(this.wishlistData["length"]);
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

  /**function wishlistCount for latest wishlist count */
  wishlistCount() {
    this.service.updatedWishlist.subscribe(resp => {});
  }

  /**function removeWislitItem for remove the item from list */
  removeWislitItem(data) {
   try {
      this.loading = true;
      this.service.removeWishlist(data).subscribe(
        resp => {
          this.loading = false;
          this.getWishList();
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

  /** function movePreviousLocation for move to bag or previous location */
  moveToBag(data) {
    this.wishListSelectedItem = data;
    if (this.userInfo) {
      // this.loading = true;
      const data = {
        user_id: this.userInfo.id,
        product_id: this.wishListSelectedItem["_id"],
        custom_id: this.wishListSelectedItem["custom_id"],
        quantity: this.wishListSelectedItem["quantity_selected"]
      };
      this.cartArray.push(data)
          this.dataObj = {
            "cart": this.cartArray
          }
      this.service.addCart(this.dataObj).subscribe(
        resp => {
          localStorage.setItem(
            "productInform",
            JSON.stringify({
              sub_category_name: this.wishlistData[0]["sub_category_name"],
              sub_category_id: this.wishlistData[0]["sub_category_id"],
              brand_name: this.wishlistData[0]["brand_name"]
            })
          );
          this.loading = false;
          this.router.navigate(["/shopping-cart"]);
        },
        error => {
          this.loading = false;
          console.log(error);
        }
      );
    }
  }
}
