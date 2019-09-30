import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { GeneralService } from "./../../service/general.service";
import { HelperCommon } from "./../../helper/helpercommon";
import { NgImageSliderComponent } from "ng-image-slider";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { CommonConstants } from "src/constant/constant";
import { ToastrManager } from 'ng6-toastr-notifications';
import { element } from "@angular/core/src/render3";
import { parse } from "url";
declare var $: any;
declare var Swiper: any;

@Component({
  selector: "app-product-page",
  templateUrl: "./product-page.component.html",
  styleUrls: ["./product-page.component.css"]
})
export class ProductPageComponent implements OnInit, AfterViewInit {
  id: any;
  session = [];
  categoriesItem: any;
  productCategoriesId: string;
  productName: string;
  id1: any;
  newFilterData = [];
  product_image = [];
  selectionFilterData = [];
  isSelected: any;
  isOpen: boolean = false;
  selected: any;
  userInfo: any;
  items: Array<any> = [];
  similarItem = [];
  recentViewedProductId: any;
  Quantities: any = [];
  newQuantities: any = [];
  quantityy: number;
  quantity: any = [];
  loading: boolean = false;
  NotificationForm: FormGroup;
  @ViewChild("nav") slider: NgImageSliderComponent;
  imageObject: Array<any> = [];
  successMsg: boolean = false;
  successMessage: string = "";
  userSelectedSize: any;
  userColor: any;
  productId: any;
  //successMsg: string;
  auto: number;
  rating: number;
  newRating: number;
  starList: boolean[] = [];
  dataObj: any = {};
  cartArray: any = [];
  custom_id = [];
  product_id = [];
  data: any;
  isSizeChecked: boolean = true;
  selectedSize: any;
  selectedColor: any = null;
  addToCartDisabled: boolean = true;
  isCheckedSizeAvail: boolean;
  isCheckedColorAvail: boolean = true;
  viewedItems: Array<any> = [];
  selectedsize: any;
  product_custom_id: any;
  product_price: any;
  availableQuantity: any;
  addWishlist: number = 0;
  wishlistData: any = [];
  wishlistDataCount: any = [];
  result: number = 0;
  getProducts: any = [];
  availableProductCount: number;
  constructor(
    private _routes: ActivatedRoute,
    private service: GeneralService,
    private router: Router,
    private fb: FormBuilder,
    public toastr: ToastrManager
  ) {}

  ngOnInit() {
    this.multipleCarousel();
    this.userInfo = HelperCommon.getUser();

    this._routes.params.subscribe(params => {
      this.id = params["_id"];
      this.id1 = params["selected_custom_id"];
    });
    this.getSubCategoryList();
    this.quantityy = 1;
    this.notificationValidations();
    this.getRecentView();
    this.getWishList();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.swiperSlide();
    }, 500);
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

  /** function swiperSlide for thumb slider  */
  swiperSlide() {
    var galleryTop = new Swiper(".Gallery", {
      direction: "horizontal",
      spaceBetween: 10,
      // Navigation arrows
      nextButton: ".swiper-button-next",
      prevButton: ".swiper-button-prev",
      pagination: ".swiper-pagination",
      zoom: {
        maxRatio: 3
      },
      loop: true,
      loopedSlides: 5
    });

    var galleryThumbs = new Swiper(".Thumbs", {
      direction: "vertical",
      spaceBetween: 10,
      centeredSlides: true,
      slidesPerView: "3",
      touchRatio: 0.2,
      slideToClickedSlide: true,
      loop: true,
      loopedSlides: 5
    });

    galleryTop.params.control = galleryThumbs;
    galleryThumbs.params.control = galleryTop;
  }

  /**function getSubCategoryList for getting the items */

  getSubCategoryList() {
    try {
      this.loading = true;
      this.service.getSubcategories(this.id, this.userInfo).subscribe(
        resp => {
          this.loading = false;
          this.categoriesItem = resp["data"];
          this.categoriesItem.forEach(element => {
            if (element["selected_custom_id"] == this.id1) {
              this.newFilterData.push(element);

              for (let i = 0; i < this.newFilterData.length; i++) {
                this.rating = this.newFilterData[i]["rating"];
                for (let j = 0; j < this.rating; j++) {
                  this.starList.push(true);
                }
                for (let k = 0; k < 5 - this.rating; k++) {
                  this.starList.push(false);
                }
              }
              this.productCategoriesId = this.newFilterData[0][
                "product_category_id"
              ];
              this.productName = this.newFilterData[0]["name"];
              this.availableQuantity = this.newFilterData[0][
                "selected_quantity"
              ];
              if (this.availableQuantity > 10) {
                for (let k = 1; k <= 10; k++) {
                  this.Quantities.push(k);
                  this.newQuantities = new Set(this.Quantities);
                }
              } else {
                for (let k = 1; k <= this.availableQuantity; k++) {
                  this.Quantities.push(k);
                  this.newQuantities = new Set(this.Quantities);
                }
              }
            }
          });

          this.product_image = this.newFilterData[0]["images"];
          this.product_price = this.newFilterData[0]["selected_price"];

          /* logic for available color on default seleceted size */
          this.selectedSize = this.newFilterData[0]["selected_size"];
          this.userSelectedSize = this.selectedSize;
          this.productId = this.newFilterData[0]["_id"];
          var filteredData = this.newFilterData[0];
          for (var i in this.newFilterData[0].available_colors) {
            let match = false;
            for (var j in filteredData.selected_products) {
              if (
                filteredData.available_colors[i] &&
                filteredData.selected_products[j] &&
                filteredData.available_colors[i].color ==
                  filteredData.selected_products[j].color
              ) {
                match = true;
                filteredData.available_colors[i].isAvailableColor = match;
                break;
              }
            }
            if (!match) {
              filteredData.available_colors[i].isAvailableColor = match;
            }
          }

          /** logic for Modified available_sizes */

          this.newFilterData[0].available_sizesModified = [];
          for (var index2 in this.newFilterData[0].available_sizes) {
            var objSize = { size: "", isAvailableSize: "true" };
            objSize.size = this.newFilterData[0].available_sizes[index2];
            this.newFilterData[0].available_sizesModified.push(objSize);
          }
          this.displayProduct();
        },
        error => {
          this.loading = false;
        }
      );
    } catch (excep) {}
  }

  /**function radioChecked for check the size*/
  radioChecked(data, id) {
    this.userSelectedSize = data;
    this.productId = id;
    this.isSizeChecked = true;
    this.displayProduct();
  }

  /**function colorSelection for color selection*/
  colorSelection(data, id) {
    this.userColor = data;
    this.productId = id;
    this.isSizeChecked = false;
    this.displayProduct();
  }

  CheckedItem(data, data1) {
    this.quantityy = data;
    // this.updateShopingCart(data, data1)
    // this.service.getCartProduct(this.userInfo).subscribe(resp => {
    //   console.log(resp);
    // });
  }

  /**function displayProduct on the basis of color, size */
  displayProduct() {
    if (this.isSizeChecked) {
      this.selectedSize = this.userSelectedSize;
      var sizesChecking = this.newFilterData[0].available_sizesModified;
      this.isCheckedSizeAvail = sizesChecking.find(
        x => x.size == this.selectedSize
      ).isAvailableSize;
      if (this.isCheckedSizeAvail === false) {
        this.selectedColor = null;
        for (var k of this.newFilterData[0].available_sizesModified) {
          k.isAvailableSize = true;
        }
      } else {
        this.selectedColor = this.selectedColor;
      }
      this.data = {
        product_id: this.productId,
        size: this.userSelectedSize
      };
    } else {
      this.selectedColor = this.userColor;
      var colorChecking = this.newFilterData[0].available_colors;
      this.isCheckedColorAvail = colorChecking.find(
        x => x.color == this.selectedColor
      ).isAvailableColor;
      if (this.isCheckedColorAvail === false) {
        this.selectedSize = null;
        for (var k of this.newFilterData[0].available_colors) {
          k.isAvailableColor = true;
        }
      } else {
        this.selectedSize = this.selectedSize;
      }
      this.data = {
        product_id: this.productId,
        color: this.userColor
      };
    }
    this.availableProductCount =
      this.newFilterData[0].available_colors.length *
      this.newFilterData[0].available_sizesModified.length;
    // console.log(this.availableProductCount,"count");

    // const data = {
    //   product_id:
    //   // this.productId,
    //     this.productId == undefined
    //       ? this.newFilterData[0]["_id"]
    //       : this.productId,
    //     this.productId? this.productId:undefined,
    //   size:
    //    this.userSelectedSize,
    //   this.userSelectedSize? this.userSelectedSize: this.lastSelectedSize,

    //     this.userSelectedSize = undefined
    //       ? this.newFilterData[0]["selected_size"]
    //       : this.userSelectedSize,
    //     this.userSelectedSize?this.userSelectedSize:undefined,
    //   color:
    //   //  this.userColor
    //   this.userColor? this.userColor: this.lastSelectedColor,
    //     this.userColor == undefined
    //       ? this.newFilterData[0]["selected_color"]
    //       : this.userColor
    //     this.userColor?this.userColor:undefined
    // };

    if (this.isSizeChecked || this.userColor) {
      this.loading = true;
      this.service.postProduct(this.data).subscribe(
        resp => {
          //
          this.loading = false;
          this.selectionFilterData = resp["data"];
          this.product_image = this.selectionFilterData[0].common_blocks.images;
          if (this.isSizeChecked) {
            for (var index1 in this.newFilterData[0].available_colors) {
              let match = false;
              for (var index2 in this.selectionFilterData) {
                if (
                  this.newFilterData[0].available_colors[index1] &&
                  this.selectionFilterData[index2] &&
                  this.newFilterData[0].available_colors[index1].color ==
                    this.selectionFilterData[index2]["common_blocks"].color
                ) {
                  match = true;
                  this.newFilterData[0].available_colors[
                    index1
                  ].isAvailableColor = match;
                  break;
                }
              }
              if (!match) {
                this.newFilterData[0].available_colors[
                  index1
                ].isAvailableColor = match;
              }
            }
          } else {
            for (var ind1 in this.newFilterData[0].available_sizesModified) {
              var newStatus = false;
              for (var ind2 in this.selectionFilterData) {
                if (
                  this.newFilterData[0].available_sizesModified[ind1] &&
                  this.selectionFilterData[ind2] &&
                  this.newFilterData[0].available_sizesModified[ind1].size ==
                    this.selectionFilterData[ind2]["common_blocks"].size
                ) {
                  newStatus = true;
                  this.newFilterData[0].available_sizesModified[
                    ind1
                  ].isAvailableSize = newStatus;
                  break;
                }
              }
              if (!newStatus) {
                this.newFilterData[0].available_sizesModified[
                  ind1
                ].isAvailableSize = newStatus;
              }
            }
          }

          /** Logic for Add to cart button enable/disable and updating data by the combination of color & size */
          if (this.selectedSize != null && this.selectedColor != null) {
            if (this.isSizeChecked) {
              var colorChecking = this.selectionFilterData;
              var selectedProduct = colorChecking.find(product => {
                return product.common_blocks.color === this.selectedColor;
              });
              this.product_custom_id = selectedProduct.common_blocks.customId;
              this.product_image = selectedProduct.common_blocks.images;
              this.product_price = selectedProduct.common_blocks.price;
            } else {
              var sizesChecking = this.selectionFilterData;
              var selectedProduct = sizesChecking.find(product => {
                return product.common_blocks.size === this.selectedSize;
              });
              this.product_custom_id = selectedProduct.common_blocks.customId;
              this.product_image = selectedProduct.common_blocks.images;
              this.product_price = selectedProduct.common_blocks.price;
            }
            this.addToCartDisabled = false;
          } else {
            this.addToCartDisabled = true;
          }

          setTimeout(() => {
            this.swiperSlide();
          }, 0);
        },
        error => {
          this.loading = false;
        }
      );
    }
  }

  /**function addToWishlist for adding the product in wishlist */
  addToWishlist() {
    try {
      if (this.userInfo) {
        this.loading = true;
        const data = {
          user_id: this.userInfo.id,
          product_id: this.newFilterData[0]["_id"],
          quantity: this.quantityy,
          custom_id: this.newFilterData[0]["selected_custom_id"]
        };
        this.service.postWishlist(data).subscribe(
          resp => {
            this.loading = false;
            // this.router.navigate(["/wishlist"]);
            this.addWishlist = 1;
            this.result = this.wishlistDataCount + this.addWishlist;
            this.service.wishlistUpdateCount.next(this.result);
            this.showToast('Product added To Wishlist', 'Success!')
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

  // shoppingCartCount() {
  // //  this.addToCart();
  //   this.service.shoppingCartUpdateCount.next(this.getProducts.length);
  //   this.service.updatedShoppingCart.subscribe(resp => {
  //     console.log(resp)
  //   });

  // }

  /**function addToCart for adding the product in cart */
  addToCart() {
    try {
      if (this.userInfo) {
        this.loading = true;
        this.newFilterData.forEach(element => {
          let temp1 = element["_id"];
          this.product_id = temp1;
          let temp2 = this.product_custom_id;
          this.custom_id = temp2;
          let temp3 = this.quantityy;
          this.quantity = temp3;
          let temp4 = this.selectedSize;
          this.selectedsize = temp4;
          const data = {
            user_id: this.userInfo.id,
            product_id: this.product_id,
            custom_id: this.custom_id,
            quantity: this.quantity
          };
          this.cartArray.push(data);
          this.dataObj = {
            cart: this.cartArray
          };
        });
        this.service.addCart(this.dataObj).subscribe(
          resp => {
            localStorage.setItem(
              "productInform",
              JSON.stringify({
                sub_category_name: this.newFilterData[0]["sub_category_name"],
                sub_category_id: this.newFilterData[0]["sub_category_id"],
                brand_name: this.newFilterData[0]["brand_name"]
              })
            );
            this.loading = false;
            this.service.getCartProduct(this.userInfo).subscribe(resp => {
              this.service.resp1.next(resp);
              this.service.getCart.subscribe(resp => {});
              this.showToast('Product added To Cart', 'Success!');
              this.service.shoppingCartUpdateCount.next(
                resp["data"]["products"].length
              );
            });
          },
          error => {
            this.loading = false;
          }
        );
      } else {
        this.loading = true;
        //var a;
        localStorage.setItem(
          "productInform",
          JSON.stringify({
            sub_category_name: this.newFilterData[0]["sub_category_name"],
            sub_category_id: this.newFilterData[0]["sub_category_id"],
            brand_name: this.newFilterData[0]["brand_name"],
            custom_id: this.product_custom_id
          })
        );
        // console.log(this.newFilterData[0])

        if (sessionStorage.getItem("session") === null) {
          this.getProducts = [];
        } else {
          this.loading = false;
          this.getProducts = JSON.parse(sessionStorage.getItem("session"));
          this.showToast('Product added To Cart', 'Success!');
        }
        const data = {
          primary_image: this.product_image[0],
          product_id: this.newFilterData[0]["_id"],
          name: this.newFilterData[0]["name"],
          seller_name: this.newFilterData[0]["seller_name"],
          selected_size: this.selectedSize,
          quantity_selected: this.quantityy,
          custom_id: this.product_custom_id,
          brand_name: this.newFilterData[0]["brand_name"],
          selected_price: this.product_price,
          shopping_cart_id: this.newFilterData[0]["_id"]
        };
        if (this.getProducts.length == 0) {
          this.getProducts.push(data);
          // this.showToast()
          this.service.shoppingCartUpdateCount.next(this.getProducts.length);
          sessionStorage.setItem("session", JSON.stringify(this.getProducts));
          this.loading = false;
        } else {
          // if (this.getProducts.filter(product =>{
          //   console.log(product.custom_id,"first")
          //   console.log(this.product_custom_id,"second")
          //   product.custom_id===this.product_custom_id})) {
          //   console.log("check")

          const index = this.getProducts.findIndex(
            item => item.custom_id === this.product_custom_id
          );
          if (index > -1) {
            this.getProducts[index]["quantity_selected"] =
              parseInt(this.getProducts[index]["quantity_selected"]) +
              Number(data.quantity_selected);
            sessionStorage.setItem("session", JSON.stringify(this.getProducts));
          }
          //   else {
          //     this.getProducts.push(data);
          //     this.service.shoppingCartUpdateCount.next(this.getProducts.length);
          //     sessionStorage.setItem("session", JSON.stringify(this.getProducts));
          //  }
          //}
          else {
            this.getProducts.push(data);
            this.service.shoppingCartUpdateCount.next(this.getProducts.length);
            sessionStorage.setItem("session", JSON.stringify(this.getProducts));
            this.loading = false;
          }
        }
      }
      //  this.router.navigate(["/shopping-cart"]);
    } catch (excep) {}
  }

  //get f() { return this.NotificationForm.controls; }
  get notifyF() {
    return this.NotificationForm.controls;
  }

  /**validation of notification form */
  notificationValidations() {
    this.NotificationForm = this.fb.group({
      email: ["", [Validators.pattern(CommonConstants.email)]]
    });
  }

  /**function rotateIcon for more information */
  rotateIcon() {
    this.isOpen = !this.isOpen;
  }

  /**function viewedProducts for similar types of product access */
  viewedProducts(data) {
    this.recentViewedProductId = data;

    this.getRecentView();
  }

  /**function getSimilarItems for getting the similar type item */
  // getSimilarItems() {
  //   try {
  //     this.loading = true;
  //     const data = {
  //       category_id: this.productCategoriesId,
  //       name: this.productName
  //     }
  //     this.service.getSimilarTypesItems(data).subscribe(resp => {
  //       this.loading = false;
  //       this.items = resp['data'];
  //       this.items.filter(element => {
  //         if (this.similarProductId === element['_id']) {
  //           this.newFilterData.push(element)
  //           window.open("#/product/" + this.newFilterData['sub_category_name'] + "/" + this.newFilterData['sub_category_id'] + "/" + "product/" + this.newFilterData['brand_id'] + "/" + this.newFilterData['brand_name']);
  //         }
  //       })
  //     }, error => {
  //       this.loading = false;
  //
  //     })
  //   } catch (excep) {
  //
  //   }
  // }

  /**function notifyCustomer for notify the customer when product avaialble */
  notifyCustomer() {
    let data = {
      email: this.NotificationForm.value.email,
      products_id: this.newFilterData[0]["_id"]
    };
    this.service.notifyUser(data).subscribe(
      resp => {
        var notifyData=resp;
        // console.log(notifyData);        
        this.showToast('We will notify you, once product is in stock','Success!')
        this.NotificationForm.reset();
        setTimeout(element => {
          this.successMsg = false;
        }, 5000);
      },
      error => {}
    );
  }

  /** function multipleCarousel for sliding images of similar styles at a time  */

  multipleCarousel() {
    $(".mul-slide").carousel({
      interval: 2000
    });

    $(".mul-slide .carousel-item").each(function() {
      var next = $(this).next();
      if (!next.length) {
        next = $(this).siblings(":first");
      }
      next
        .children(":first-child")
        .clone()
        .appendTo($(this));

      for (var i = 0; i < 2; i++) {
        next = next.next();
        if (!next.length) {
          next = $(this).siblings(":first");
        }

        next
          .children(":first-child")
          .clone()
          .appendTo($(this));
      }
    });
  }

  /** function of recent view on product page  */
  getRecentView() {
    try {
      if (this.userInfo) {
        // this.loading = true;
        const user_id = this.userInfo.id;
        // this.newFilterData = [];
        this.service.recentlyViewed(user_id).subscribe(
          resp => {
            this.loading = false;
            this.items = resp["data"];

            this.items.filter(element => {
              if (this.recentViewedProductId === element["_id"]) {
                this.newFilterData.push(element);
                window.open(
                  "#/product/" +
                    this.newFilterData[0]["sub_category_name"] +
                    "/" +
                    this.newFilterData[0]["sub_category_id"] +
                    "/" +
                    "product/" +
                    this.newFilterData[0]["selected_custom_id"] +
                    "/" +
                    this.newFilterData[0]["brand_name"]
                );
              }
            });

            // this.postRecentView();
            setTimeout(() => {
              this.postRecentView();
            }, 500);
          },
          error => {
            this.loading = false;
            if (error.status === 400) {
              //this.router.navigate(['/login'])
            }
          }
        );
      } else {
        // this.router.navigate(['/login'])
      }
    } catch (excep) {}
  }

  /** function postRecentView for showing recently viewed data */
  postRecentView() {
    let data = {
      user_id: this.userInfo.id,
      product_id: this.newFilterData[0]["_id"]
    };
    this.service.postRecentlyViewed(data).subscribe(
      resp => {
        this.loading = false;
        this.viewedItems = resp["data"];
      },
      error => {
        this.loading = false;
        if (error.status === 400) {
        }
      }
    );
  }

  /** function removeViewedItems for removing recently viewed history */
  removeViewedItems() {
    try {
      this.service.deleteRecentlyViewedItems(this.userInfo.id).subscribe(
        resp => {
          this.getRecentView();
          this.loading = false;
          this.successMsg = true;
          // this.successMessage = "Your recently viewed items has been removed.";
          this.showToast('Recently viewed items removed','Success!');
        },
        error => {
          this.loading = false;
        }
      );
    } catch (excep) {
      console.log(excep);
    }
  }
}
