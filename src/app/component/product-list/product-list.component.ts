import { HelperCommon } from "./../../helper/helpercommon";
import {
  Component,
  OnInit,
  AfterViewInit,
  HostListener,
  ElementRef
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GeneralService } from "./../../service/general.service";
import { ToastrManager } from 'ng6-toastr-notifications';
import { Options } from "ng5-slider";
import { element } from "@angular/core/src/render3";
import { $ } from "protractor";
import { isArray } from "util";
import { MalihuScrollbarService } from "ngx-malihu-scrollbar";
import { window } from "rxjs/operators";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"]
})
export class ProductListComponent implements OnInit, AfterViewInit {
  id: any;
  subCategoriesItems = [];
  subCategoriesItems1 = [];
  subCategoriesItemsId: any;
  loading: boolean = false;
  dataAccess: boolean = false;
  dataAccess1: boolean = false;
  isUncheck: boolean;
  // isDisplay: boolean = true;
  minValue: any = "0";
  maxValue: any = "10000";
  myDefaultValue: number;
  brandsList: any = [];
  newFilterResult: any = [];
  sizes: any = [];
  colors: any = [];
  groupId: any;
  dropDownValue: boolean;
  productFilter: any = [];
  productList: any = [];
  newBrand: any = [""];
  newColor: any = [""];
  newSize: any = [""];
  page: number = 1;
  pageSize: number = 10;
  paginationShow: any = [];
  productSort: any = [];
  userInfo: any;
  wishlistData: any = [];
  isUnchecks = 0;
  isChecks = 0;
  brandId: any;
  brandName: any;
  size: any;
  color: any;
  defaultImage: boolean = false;
  successMessage:string;
  successMsg:boolean=false;
  checkDiscount: any;
  accessId: any;
  promotionId: any;
  hotDealsId: any;
  addWishCount = 0;
  removeWishCount = 0;
  result = 0;
  options: Options = {
    floor: 0,
    ceil: 10000,
    step: 500,
    enforceStep: false,
    enforceRange: false
  };
  sideBar: boolean;
  constructor(
    private _routes: ActivatedRoute,
    private service: GeneralService,
    private router: Router,
    private scrollbarService: MalihuScrollbarService,
    private elementRef: ElementRef,
    public toastr: ToastrManager
  ) {}

  ngOnInit() {
    this.userInfo = HelperCommon.getUser();
    this.checkedBrand();
    this.getIdBasedData();
    this.getProduct();
    this.filterList();
    this.dropDownClick();
  }

  /**function showToast for showing different type of notification*/
  showToast(data, title) {
    switch (title) {
      case "Success!": {
        console.log("Excellent");
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
        console.log("Fair");
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
        console.log("Fair");
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

  /** function toggleSideBar for chnging state of sidebar */
  toggleSideBar() {
    this.sideBar = !this.sideBar;
  }

  ngAfterViewInit() {
    this.scrollbarService.initScrollbar("#scrollable", {
      axis: "y",
      theme: "light",
      scrollButtons: { enable: true },
      contentTouchScroll: true
    });
  }

  /**function getIdBasedData for get the id */
  getIdBasedData() {
    // const firstParam: string = this._routes.snapshot.queryParamMap.get(
    //   "productCategory"
    // );
    try {
      this.loading = true;
      this._routes.params.subscribe(params => {
        this.loading = false;
        this.id = params["_id"];
        this.checkedBrand();
        this.getSubCategoryList(this.id);
        this.getWishList();
        this.filterList();
      });
    } catch (excep) {
      console.log(excep);
    }
  }

  /**function getSubCategoryList for getting the list*/
  getSubCategoryList(data) {
    this.subCategoriesItemsId = this._routes.snapshot.params["_id"];

    try {
      if (this.userInfo) {
        this.loading = true;
        this.service.getSubcategories(data, this.userInfo).subscribe(
          resp => {
            this.loading = true;
            if (resp["data"].length == 0) {
              this.dataAccess1 = true;
              this.dataAccess = false;
              this.loading = false;
            } else {
              this.loading = true;
              // this.minValue=0;
              // this.maxValue=10000;
              this.dataAccess1 = false;
              this.dataAccess = true;
              this.productSort = [];
              this.productFilter = [];
              this.subCategoriesItems = [];
              this.subCategoriesItems = resp["data"];
              this.loading = false;
              // this.subCategoriesItem = resp["data"];
              if (!this.dropDownValue) {
                // brand promotion
                if (this.checkDiscount === "promotionDiscount") {
                  resp["data"].filter(element => {
                    if (element["_id"] === this.promotionId) {
                      this.subCategoriesItems = [];
                      this.subCategoriesItems = this.subCategoriesItems1;
                      this.dropDownValue = true;
                      this.isUncheck = false;
                    }
                  });
                }
                // accesories
                else if (this.checkDiscount === "accessoriesDiscount") {
                  resp["data"].filter(element => {
                    if (element["_id"] === this.accessId) {
                      this.subCategoriesItems = [];
                      this.subCategoriesItems = this.subCategoriesItems1;
                      this.dropDownValue = true;
                      this.isUncheck = false;
                    }
                  });
                }
                //brand
                else if (this.checkDiscount === "brandDiscount") {
                  resp["data"].filter(element => {
                    if (element["_id"] === this.brandId) {
                      this.subCategoriesItems = [];
                      this.subCategoriesItems = this.subCategoriesItems1;
                      this.dropDownValue = true;
                      this.isUncheck = false;
                    }
                  });
                }

                //hotDeals
                else if (this.checkDiscount === "hotDealsDiscount") {
                  resp["data"].filter(element => {
                    if (element["_id"] === this.hotDealsId) {
                      this.subCategoriesItems = [];
                      // this.subCategoriesItems.push(element);
                      this.subCategoriesItems = this.subCategoriesItems1;
                      this.dropDownValue = true;
                      this.isUncheck = false;
                    }
                  });
                }

                //categories
                else if (this.checkDiscount === "categoriesDiscount") {
                  this.subCategoriesItems = [];
                  this.subCategoriesItems = resp["data"];
                  this.dropDownValue = false;
                  this.isUncheck = false;
                }
              }
              // // When we click on dropdown after select home page
              // if(this.subCategoriesItems === resp["data"]){
              //   this.brandName=null
              // }
              else {
                this.subCategoriesItems = [];
                this.subCategoriesItems = resp["data"];
                this.dropDownValue = false;
              }

              this.subCategoriesItems.filter(element => {
                element["check"] = false;
              });
              this.getWishList();
              this.checkWishlistProduct();
              this.checkWishlistProductFilter();
              this.checkWishlistProductSort();
              // this.filterList();
            }
            this.loading = false;
          },
          error => {
            this.loading = false;
            console.log(error);
          }
        );
      } else {
        this.loading = true;

        this.service.getSubcategoriesNotLogin(data).subscribe(
          resp => {
            this.loading = false;
            if (resp["data"].length == 0) {
              this.dataAccess1 = true;
              this.dataAccess = false;
            } else {
              // this.minValue=0;
              // this.maxValue=10000;
              this.dataAccess1 = false;
              this.dataAccess = true;
              this.productSort = [];
              this.productFilter = [];
              this.subCategoriesItems = [];
              // this.subCategoriesItem = resp["data"];
              this.subCategoriesItems = resp["data"];
              if (!this.dropDownValue) {
                // brand promotion
                if (this.checkDiscount === "promotionDiscount") {
                  resp["data"].filter(element => {
                    if (element["_id"] === this.promotionId) {
                      this.subCategoriesItems = [];
                      this.subCategoriesItems = this.subCategoriesItems1;
                      this.dropDownValue = true;
                      this.isUncheck = false;
                    }
                  });
                }
                // accesories
                else if (this.checkDiscount === "accessoriesDiscount") {
                  resp["data"].filter(element => {
                    if (element["_id"] === this.accessId) {
                      this.subCategoriesItems = [];
                      this.subCategoriesItems = this.subCategoriesItems1;
                      this.dropDownValue = true;
                      this.isUncheck = false;
                    }
                  });
                }
                //brand
                else if (this.checkDiscount === "brandDiscount") {
                  resp["data"].filter(element => {
                    if (element["_id"] === this.brandId) {
                      this.subCategoriesItems = [];
                      this.subCategoriesItems = this.subCategoriesItems1;
                      this.dropDownValue = true;
                      this.isUncheck = false;
                    }
                  });
                }

                //hotDeals
                else if (this.checkDiscount === "hotDealsDiscount") {
                  resp["data"].filter(element => {
                    if (element["_id"] === this.hotDealsId) {
                      this.subCategoriesItems = [];
                      this.subCategoriesItems = this.subCategoriesItems1;
                      this.dropDownValue = true;
                      this.isUncheck = false;
                    }
                  });
                }

                //categories
                else if (this.checkDiscount === "categoriesDiscount") {
                  this.subCategoriesItems = [];
                  this.subCategoriesItems = resp["data"];
                  // this.dropDownValue = false;
                  // this.isUncheck = true;
                }
              } else {
                this.subCategoriesItems = [];
                this.subCategoriesItems = resp["data"];
                this.dropDownValue = false;
              }

              // // When we click on dropdown after select home page
              // if (this.subCategoriesItems === resp["data"]) {
              //   this.brandName = null;
              // }
              // }
              resp["data"].filter(element => {
                element["check"] = false;
              });
              this.getWishList();
              this.checkWishlistProduct();
              this.checkWishlistProductFilter();
              this.checkWishlistProductSort();
              //this.brandsList = [];
              // this.filterList();
            }
            this.loading = false;
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

  dropDownClick() {
    this.service.getDropDown.subscribe(resp => {
      this.dropDownValue = resp;
      if (this.dropDownValue) {
        delete this.checkDiscount;
      }
      this.isUncheck = true;
    });
  }

  onLogoClick() {
    this.service.getDropDown.subscribe(resp => {
      this.dropDownValue = resp;
    });
  }
  /**function checkedBrand recognize and validate the checkedDiscount  */
  checkedBrand() {
    try {
      this.loading = true;
      this.service.getSelectedBrand.subscribe(
        resp2 => {
          if (resp2["data"] != null) {
            if (resp2["data"][0]["checkDiscount"] === "brandDiscount") {
              this.loading = false;
              this.subCategoriesItems1 = [];
              this.subCategoriesItems1 = resp2["data"];
              this.checkDiscount = resp2["data"][0]["checkDiscount"];
              this.brandId = resp2["data"][0]["_id"];
              this.brandName = resp2["data"][0]["brand_name"];
              this.size = resp2["data"][0]["selected_size"];
              this.color = resp2["data"][0]["selected_color"];
              this.onLogoClick();
            } else if (
              resp2["data"][0]["checkDiscount"] === "accessoriesDiscount"
            ) {
              this.loading = false;
              this.subCategoriesItems1 = [];
              this.subCategoriesItems1 = resp2["data"];
              this.checkDiscount = resp2["data"][0]["checkDiscount"];
              this.accessId = resp2["data"][0]["_id"];
              this.brandName = resp2["data"][0]["brand_name"];
              this.size = resp2["data"][0]["selected_size"];
              this.color = resp2["data"][0]["selected_color"];
              this.onLogoClick();
            } else if (
              resp2["data"][0]["checkDiscount"] === "promotionDiscount"
            ) {
              this.loading = false;
              this.subCategoriesItems1 = [];
              this.subCategoriesItems1 = resp2["data"];
              this.checkDiscount = resp2["data"][0]["checkDiscount"];
              this.promotionId = resp2["data"][0]["_id"];
              this.brandName = resp2["data"][0]["brand_name"];
              this.size = resp2["data"][0]["selected_size"];
              this.color = resp2["data"][0]["selected_color"];
              this.onLogoClick();
            } else if (
              resp2["data"][0]["checkDiscount"] === "hotDealsDiscount"
            ) {
              this.loading = false;
              this.subCategoriesItems1 = [];
              this.subCategoriesItems1 = resp2["data"];
              this.checkDiscount = resp2["data"][0]["checkDiscount"];
              this.hotDealsId = resp2["data"][0]["_id"];
              this.brandName = resp2["data"][0]["brand_name"];
              this.size = resp2["data"][0]["selected_size"];
              this.color = resp2["data"][0]["selected_color"];
              this.onLogoClick();
            } else if (
              resp2["data"][0]["checkDiscount"] === "categoriesDiscount"
            ) {
              this.loading = false;
              this.subCategoriesItems = [];
              this.subCategoriesItems = resp2["data"];
              this.checkDiscount = resp2["data"][0]["checkDiscount"];
              this.onLogoClick();
            } else {
              this.dropDownValue = false;
            }
          }
        },
        err => {
          this.loading = false;
        }
      );
    } catch (excep) {
      console.log(excep);
    }
  }

  /**function brandPromotionsResult for getting the list in home page*/
  productFilterList(data: any) {
    try {
      this.loading = true;
      const offer_id: string = this._routes.snapshot.queryParamMap.get("id");
      this.service.getBrandPromotionList(offer_id).subscribe((resp: any) => {
        if (resp && resp["data"].length == 0) {
          this.dataAccess1 = true;
          this.dataAccess = false;
        } else if (resp && resp["data"] != null) {
          this.dataAccess1 = false;
          this.dataAccess = true;
          this.subCategoriesItems = resp["data"];
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
    } catch (excep) {
      console.log(excep);
    }
  }

  /**function for getting the list in home page*/
  filterList() {
    try {
      this.loading = true;
      this.service.getProductFilterList(this.subCategoriesItemsId).subscribe(
        (resp: any) => {
          this.loading = false;
          this.brandsList = [];
          this.brandsList = resp["data"].brand_name;
          this.sizes = resp["data"].size;
          this.colors = resp["data"].color;
          if (this.dropDownValue && resp["data"].brand_name !== undefined) {
            resp["data"].brand_name.filter(element => {
              if (element["name"] === this.brandName) {
                this.brandsList = [];
                this.brandsList.push(element);
              }
            });
          } else {
            this.brandsList = resp["data"].brand_name;
            this.sizes = resp["data"].size;
            this.colors = resp["data"].color;
          }
        },
        err => {
          this.loading = false;
        }
      );
    } catch (excep) {
      console.log(excep);
    }
  }
  /**function for priceChange for handling the null value*/
  priceChange(val) {
    val === null ? (this.minValue = "0") : val;
  }
  /**function getproduct for list of product */
  getProduct() {
    try {
      this.service.getProduct().subscribe(resp => {
        this.productList = resp["data"];
        this.productList.find(element => {
          if (element["group_name"] == "Fashion") {
            this.groupId = element["group_id"];
          }
        });
      });
    } catch (excep) {
      console.log(excep);
    }
  }

  /**function for getting the list in home page*/
  ProductfilterList(e: any, event: any, name) {
    try {
      this.productSort = [];
      this.loading = true;
      const newData = {
        brand_name: (name == "brand") === true ? this.newBrand : "",
        color: (name == "color") === true ? this.newColor : "",
        size: (name == "size") === true ? this.newSize : "",
        start_price: this.minValue === "0" ? "" : this.minValue,
        end_price: this.maxValue === "0" ? "" : this.maxValue
      };

      if (e.target.checked == true) {
        this.isChecks = this.isChecks + 1;

        if (name == "brand" && !this.newBrand.includes(event)) {
          this.newBrand.push(event);
        }
        if (name == "color" && !this.newBrand.includes(event)) {
          this.newColor.push(event);
        }
        if (name == "size" && !this.newBrand.includes(event)) {
          this.newSize.push(event);
        }
        this.service
          .getApplyProductFilter(
            this.groupId,
            this.subCategoriesItemsId,
            newData
          )
          .subscribe(
            (resp: any) => {
              this.loading = false;
              this.subCategoriesItems = [];
              this.productSort = [];
              this.productFilter = resp["data"];
            },
            err => {
              this.loading = false;
            }
          );
      } else if (e.target.checked == false) {
        this.isChecks = this.isChecks - 1;
        if (name == "brand" && this.newBrand.includes(event)) {
          const index = this.newBrand.indexOf(event);
          this.newBrand.splice(index, 1);
        }
        if (name == "color" && this.newColor.includes(event)) {
          const index = this.newColor.indexOf(event);
          this.newColor.splice(index, 1);
        }
        if (name == "size" && this.newSize.includes(event)) {
          const index = this.newSize.indexOf(event);
          this.newSize.splice(index, 1);
        }
        this.service
          .getApplyProductFilter(
            this.groupId,
            this.subCategoriesItemsId,
            newData
          )
          .subscribe(
            (resp: any) => {
              this.loading = false;
              this.subCategoriesItems = [];
              if (!this.isUncheck && this.isChecks === 0) {
                this.productFilter = this.subCategoriesItems1;
              } else if (this.isChecks != 0) {
                this.productFilter = resp["data"];
              } else {
                this.productFilter = resp["data"];
              }
              if (this.productFilter.length === 0) {
                this.getSubCategoryList(this.subCategoriesItemsId);
              }
            },
            err => {
              this.loading = false;
            }
          );
      } else {
        this.service
          .getApplyProductFilter(
            this.groupId,
            this.subCategoriesItemsId,
            newData
          )
          .subscribe(
            (resp: any) => {
              this.loading = false;
              this.defaultImage = false;
              this.productFilter = resp["data"];
              this.subCategoriesItems = [];
              if (this.productFilter.length === 0) {
                this.defaultImage = true;
              }
              if (this.checkDiscount) {
                this.subCategoriesItems1.filter(sub => {
                  if (sub.selected_price > this.minValue) {
                    this.productFilter = this.subCategoriesItems1;
                  } else {
                   //this.defaultImage = true;
                  }
                });

               // this.defaultImage = true;
              }
            },
            err => {
              this.loading = false;
            }
          );
      }
    } catch (excep) {
      console.log(excep);
    }
  }
  /**function for removing the filteration*/
  revomeFilter(form, data) {
    this.productFilter = [];
    form.reset();
    this.getSubCategoryList(data);
    this.minValue = "0";
    this.maxValue = "10000";
    this.options.floor = 0;
    this.options.ceil = 10000;
    this.options.enforceStep = false;
    this.options.enforceRange = false;
    this.filterList();
  }

  /**function for sorting the product*/
  postSort(event) {
    // this.minValue=0;
    // this.maxValue=10000;
    this.productFilter = [];
    try {
      this.loading = true;
      const newData = {
        sort_type: event
      };
      this.service
        .postSortProduct(this.subCategoriesItemsId, newData)
        .subscribe(
          (resp: any) => {
            this.loading = false;
            this.subCategoriesItems = [];
            this.productSort = resp["data"];
          },
          err => {
            this.loading = false;
          }
        );
    } catch (excep) {
      console.log(excep);
    }
  }

  /**function addToWishlist for adding the product in wishlist */
  addToWishlist(item, i) {
    try {
      if (this.userInfo) {
        this.loading = true;
        const data = {
          user_id: this.userInfo.id,
          product_id: item._id,
          //quantity: this.quantityy,
          custom_id: item.selected_custom_id
        };
        this.service.postWishlist(data).subscribe(
          resp => {
            this.loading = false;
            //  this.router.navigate(["/wishlist"]);
            if (this.subCategoriesItems[i]["check"] == true) {
              this.subCategoriesItems[i]["check"] = false;
              this.wishlistData.filter(element => {
                if (element._id == item._id) {
                  this.removeWislitItem(element.wish_list_id);
                }
              });
              //wishlist remove------------
              this.removeWishCount = this.removeWishCount - 1;
              this.showToast('Product Removed From Wishlist', 'Success!')
              //wishlist remove end---------
            } else {
              this.subCategoriesItems[i]["check"] = true;
              this.getWishList();
              //wishlist add------------

              this.addWishCount = this.addWishCount + 1;
              this.showToast('Product Added To Wishlist', 'Success!');
              // wishlist add end--------------
            }
            //add
            this.result = this.removeWishCount + this.addWishCount;
            this.service.wishlistUpdateCount.next(this.result);
       
           
            //add --------
          },
          error => {
            this.loading = false;
            if (error.status === 400) {
              this.router.navigate(["/login"]);
            }
          }
        );
      } else {
        this.router.navigate(["/login"]);
      }
    } catch (excep) {}
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
            this.result = this.removeWishCount + this.addWishCount;
            this.service.wishlistUpdateCount.next(this.result);
            this.checkWishlistProduct();
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

  /**function checkWishlistShooping check the id of shopping cart and wishlist*/
  checkWishlistProduct() {
    for (let i in this.subCategoriesItems) {
      for (let j in this.wishlistData) {
        if (this.wishlistData[j]["_id"] == this.subCategoriesItems[i]["_id"]) {
          this.subCategoriesItems[i]["check"] = true;
          
        }
      }
    }
  }

  /**function checkWishlistShooping check the id of shopping cart and wishlist*/
  checkWishlistProductFilter() {
    for (let i in this.productFilter) {
      for (let j in this.wishlistData) {
        if (this.wishlistData[j]["_id"] == this.productFilter[i]["_id"]) {
          this.productFilter[i]["check"] = true;
        }
      }
    }
  }
  /**function checkWishlistProductSort check the active data in wishlist*/
  checkWishlistProductSort() {
    for (let i in this.productSort) {
      for (let j in this.wishlistData) {
        if (this.wishlistData[j]["_id"] == this.productSort[i]["_id"]) {
          this.productSort[i]["check"] = true;
        }
      }
    }
  }

  /**function removeWislitItem for remove the item from list */
  removeWislitItem(data) {
    try {
      this.loading = true;
      this.service.removeWishlist(data).subscribe(
        resp => {
          this.loading = false;
          
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
}
