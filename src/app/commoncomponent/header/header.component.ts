import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { HelperCommon } from "./../../helper/helpercommon";
import { Router } from "@angular/router";
import { GeneralService } from "./../../service/general.service";
import { HostListener } from "@angular/core";
import { SolutionEntry } from "../../../constant/solutionData";
import { S_IFREG } from "constants";

declare var $: any;

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  userInfo: any;
  userCheck: boolean = false;
  categoriesData = [];
  name: string;
  _id: string;
  shoppingCartProduct = [];
  wishlistData = [];
  dataHeader = true;
  parentHeight: any;
  @ViewChild("mainScreen") mainScreen: ElementRef;
  @ViewChild("triggerHambruger") triggerHambruger: ElementRef;
  viewHeight: number;
  status: boolean = false;
  isDone: boolean = false;
  selectedId = null;
  scrHeight: any;
  scrWidth: any;
  loading: boolean = false;
  productCategoryName: any;
  productList: any = [];
  groupId: any;
  searchText: string = "";
  productId: any;
  autocomplete: any;
  wishlistDataCount: any;
  shoppingCartDataCount: any;
  searchInfo: any;
  product_info: any = [];
  checkDropDown: boolean;
  defaultDropDown: boolean;
  productCount: any;
  newWishlistDataCount: any;
  count: boolean = false;
  profile_name: any;
  userProfile: any;
  constructor(private router: Router, private service: GeneralService) {}

  ngOnInit() {
    this.headerAccess();
    this.getList();
    this.getShoppingCart();
    this.getWishList();
    this.getScreenSize();
    this.userInfo = HelperCommon.getUser();
    this.wishlistCount();
    this.shoppingCartCount();
    this.getProduct();
    this.getProfile(this.userInfo);
    // this.newWishlistCount();
    //this.mainSearch();
  }
  profileName() {
    var userName = this.userInfo["name"];
    //  var str = (userName && userName.length > 10) ? userName.split(" ")[0][0] + userName.split(" ")[1][0] : userName;
    this.service.userProfileData.subscribe(resp => {
      this.profile_name = resp;
    });
  }

  /**function getProfile for getting the profile of user based id */
  getProfile(data) {
    this.service.getUserProfile(data["id"]).subscribe(resp => {
     this.service.userProfile.next(resp["data"][0].name);
      this.userProfile = resp["data"][0];
       var profile_location = "profile";
      localStorage.setItem("profileUrl", profile_location);
    });
  }


  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
  }

  /** function showOptions for showing the hover and handling dropdown menu height */
  showOptions() {
    this.dataHeader = true;
    if (this.scrWidth > 991) {
      this.viewHeight = this.mainScreen.nativeElement.offsetHeight;
    }
  }

  /**function setItemForProduct foe set the url id */
  setItemForProduct(name1, id) {
    this.name = name1;
    this._id = id;
    this.router.navigate(["/product/" + this.name + "/" + this._id]);
    this.dataHeader = false;
    if (this.scrWidth < 992) {
      this.hamburgerClick();
    }
    this.checkDropDown = true;
    this.service.dropDown.next(this.checkDropDown);
    this.service.getDropDown.subscribe(resp => {});
  }

  hamburgerClick() {
    if (this.scrWidth < 992) {
      let el: HTMLElement = this.triggerHambruger.nativeElement as HTMLElement;
      el.click();
    }
  }

  /**function getList for getting the categories*/
  getList() {
    try {
      this.productCategoryName = SolutionEntry.productFilter;
      this.loading = true;
      this.service.getProductList().subscribe(
        resp => {
          this.loading = false;
          resp["data"].filter(element => {
            if (element["group_name"] == this.productCategoryName) {
              this.categoriesData.push(element);
            }
          });
        },
        error => {
          // this.loading = false;
          console.log(error);
        }
      );
    } catch (excep) {
      console.log(excep);
    }
  }
  /**function HomePage when click pass value false*/
  HomePage() {
    this.router.navigate(["/"]);
    this.defaultDropDown = false;
    this.service.dropDown.next(this.defaultDropDown);
    this.service.getDropDown.subscribe(resp => {});
  }

  /**function getShoppingCart for getting the product */
  getShoppingCart() {
    try {
      if (this.userInfo) {
        this.profileName();
        this.loading = true;
        this.service.getCartProduct(this.userInfo["id"]).subscribe(
          resp => {
            this.loading = false;
            this.shoppingCartProduct = resp["data"]["products"];
            this.shoppingCartDataCount = resp["data"]["products"].length;
            this.getWishList();
          },
          err => {
            if (err.status == 401 || err.status == 400) {
              localStorage.removeItem("token");
              localStorage.removeItem("currentUser");
              this.router.navigate(["/"]);
            }
          }
        );
      } else {
        this.shoppingCartProduct = JSON.parse(
          sessionStorage.getItem("session")
        );
        if (this.shoppingCartProduct != null) {
          this.shoppingCartDataCount = this.shoppingCartProduct.length;
        }
      }
    } catch (excep) {
      console.log(excep);
    }
  }

  /**function wishlistCount for latest wishlist count */
  wishlistCount() {
    this.service.updatedWishlist.subscribe(resp => {
      this.wishlistDataCount = resp;
    });
  }

  // newWishlistCount(){
  //   this.service.shoppingUpdatedWishlist.subscribe(resp => {
  //     // this.wishlistDataCount = resp;
  //    this.newWishlistDataCount= resp
  //    console.log(this.newWishlistDataCount)
  //  });
  // }

  /**function shoppingCartCount for latest shopping cart count */
  shoppingCartCount() {
    this.service.updatedShoppingCart.subscribe(resp => {
      if (
        this.shoppingCartDataCount != 0 ||
        this.shoppingCartDataCount != null
      ) {
        this.shoppingCartDataCount = resp;
      }
    });
  }

  /** function getWishList for getting the wishlist product */
  getWishList() {
    try {
      if (this.userInfo) {
        this.loading = true;
        this.service.getWishlist(this.userInfo["id"]).subscribe(
          resp => {
            this.loading = false;
            this.wishlistData = resp["data"]["products"];
            this.wishlistDataCount = resp["data"]["products"].length;
          },
          error => {
            if (error.status == 401 || error.status == 400) {
              localStorage.removeItem("token");
              localStorage.removeItem("currentUser");
              this.router.navigate(["/"]);
            }
            // this.loading = false;
            console.log(error);
          }
        );
      }
    } catch (excep) {
      console.log(excep);
    }
  }

  /** headerAccess for header*/
  headerAccess() {
    this.userInfo = HelperCommon.getUser();
    if (this.userInfo) {
      this.userCheck = false;
    } else {
      this.userCheck = true;
      this.getShoppingCart();
      this.getWishList();
    }
  }

  // function offCanvas for Hamburger button and Mobile Menu Controls
  offCanvas() {
    var mainNavbarHeight = $(".navbar-sidebar-horizontal").outerHeight();
    $(".sidebar-horizontal.fixed-top").css({ top: mainNavbarHeight + "px" });

    $(".hamburger").toggleClass("is-active");
    $(".offcanvas-collapse").toggleClass("open");
    // if ($(".hamburger").hasClass("is-active")) {
    //   $(".hamburger").removeClass("is-active");
    // } else {
    //   $(".hamburger").addClass("is-active");
    // }
    // e.preventDefault();
  }

  /** function toggleClass for toggling the category list */
  toggleClass() {
    if (this.scrWidth < 992) {
      this.status = !this.status;
    }
  }

  /** function toggleSubClass for toggling the sub category list */
  toggleSubClass(id: any) {
    if (this.scrWidth < 992) {
      event.stopPropagation();
      if (this.selectedId == id) {
        this.selectedId = null;
      } else {
        this.selectedId = id;
      }
    }
  }

  /**function logout for logout the user */
  logout() {
    this.getShoppingCart();
    // this.getWishList();
    let profileUrl = localStorage.getItem("profileUrl");
    if (profileUrl && profileUrl == "profile") {
      this.router.navigate(["login"]);
      localStorage.removeItem("profileUrl");
    } else {
      location.reload();
      // this.router.navigate(["/"]);
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
      this.userInfo = HelperCommon.getUser();
      if (this.userInfo) {
        this.userCheck = false;
      } else {
        this.userCheck = true;
      }
    }
  }
  /**function getproduct for list of product */
  getProduct() {
    try {
      this.loading = true;
      this.service.getProduct().subscribe(resp => {
        this.loading = false;
        this.productList = resp["data"];
        for (let i = 0; i < this.productList.length; i++) {
          if (this.productList[i]["group_name"] == "Fashion") {
            this.groupId = this.productList[i]["group_id"];
          }
        }
      });
    } catch (excep) {
      console.log(excep);
    }
  }
  /**function mainSearch for search the product */
  mainSearch() {
    try {
      this.loading = true;
      let id = this.groupId;
      let data = this.searchText;
      this.onInput(this.searchText);
      this.service.getSearch(id, data).subscribe(resp => {
        this.loading = false;
        if (resp["data"][0] != null) {
          if (resp["data"].length != 0) {
            this.product_info = resp["data"];
            this.productId = resp["data"][0]["_id"];
          }
        }
      });
    } catch (excep) {
      console.log(excep);
    }
  }
  /**function searchLoad  to call  the main search*/
  searchLoad() {
    if (this.searchText.length > 0) {
      this.mainSearch();
    }
  }
  /**function mainSearch for search the product */
  getSearchResult() {
    try {
      this.loading = true;
      let id = this.productId;

      this.service.getSearchDetail(id).subscribe(resp => {
        this.loading = false;
        this.searchInfo = resp["data"];
        window.open(
          "#/product/" + "products_after_search" + "/" + this.productId,
          "_self"
        );
        this.searchText = "";
      });
    } catch (excep) {
      console.log(excep);
    }
  }

  /**function onInput for calculate the length of character of search */
  onInput(searchText) {
    var val = document.getElementById("input")["value"];
    var val1 = document.getElementById("input1")["value"];
    setTimeout(() => {
      if (searchText.length > 0) {
        var opts = document.getElementById("browsers").childNodes;
        for (var i = 0; i < opts.length; i++) {
          if (opts[i]["value"] === val) {
            this.getSearchResult();
            break;
          } else if (opts[i]["value"] === val1) {
            this.getSearchResult();
            break;
          }
        }
      }
    }, 0);

    // if (searchText.length > 2) {
    //   var opts = document.getElementById("browsers").childNodes;
    //   for (var i = 0; i < opts.length; i++) {
    //     if (opts[i]["value"] === val1) {
    //       this.getSearchResult();
    //       break;
    //     }
    //   }
    // }
  }
}
