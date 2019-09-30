import { GeneralService } from "./../../service/general.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { NgImageSliderComponent } from "ng-image-slider";
import { element } from "@angular/core/src/render3";

declare var $: any;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  @ViewChild("nav") slider: NgImageSliderComponent;
  imageObject: any = [];
  product_category_list: any = [];
  userInfo: any;
  loading: boolean = false;
  brandPromotions: any = [];
  brandOffers: any = [];
  accessories: any = [];
  hotDeals: any = [];
  fashionList: any = [];
  image1: any[] = [];
  image: any = [];
  thumbImage: any[] = [];
  categoryData: any = [];
  accessoriesData: any = [];
  brandOfferData: any = [];
  brandPromotionData: any = [];
  hotDealsData: any;
  brandPromotionId: any = [];
  hotDealsId: any;

  prevImageClick() {
    this.slider.prev();
  }

  nextImageClick() {
    this.slider.next();
  }

  constructor(
    private readonly location: Location,
    private service: GeneralService
  ) {}

  ngOnInit() {
    this.location.replaceState("/");
    this.getCategory();
    this.getPromotion();
    this.getOffer();
    this.getAccessories();
    this.getHotDeals();
  }

  /** function  for  sliding images for hot deals */
  getHotDeals() {
    this.service.getBrandHotDeals().subscribe(resp => {
      if (resp.status) {
        this.hotDeals = resp.data;
        this.imageSlider(resp.data);
        if (this.hotDeals.length > 0) {
          for (let i = 0; i < this.hotDeals.length; i++) {
            this.image.push(this.hotDeals[i]["image"]);
            // this.hotDealsId = this.hotDeals[i]["id"];
          }
        }
      }
    });
  }

  /** function imageSlider for sliding images for hot deals */
  imageSlider(values: any) {
    // this.imageObject = [
    //   {
    //     image: this.image[0],
    //     thumbImage: this.image[0]
    //   },
    //   {
    //     image: this.image[1],
    //     thumbImage: this.image[1]
    //   },
    //   {
    //     image: this.image[2],
    //     thumbImage: this.image[2]
    //   },
    //   {
    //     image: this.image[3],
    //     thumbImage: this.image[3]
    //   }
    // ];
    for (let i = 0; i < values.length; i++) {
      this.imageObject.push({
        image: values[i].image,
        thumbImage: values[i].image,
        id: values[i].id
      });
    }
  }
  /** function for category offer in home page  */
  getCategory() {
    this.service.getProductCategory().subscribe(resp => {
      this.product_category_list = resp["data"];
    });
  }
  /** function for brand category in home page  */
  getPromotion() {
    this.service.getBrandPromotion().subscribe(resp => {
      this.brandPromotions = resp["data"];

      for (let i = 0; i < this.brandPromotions.length; i++) {
        if (this.brandPromotions[i]["image"]) {
          this.image1.push(this.brandPromotions[i]["image"]);
          this.brandPromotionId.push(this.brandPromotions[i]["id"]);
        }
      }
    });
  }
  /** function for brand offer in home page  */
  getOffer() {
    this.service.getBrandOffer().subscribe(resp => {
      this.brandOffers = resp["data"];
    });
  }
  /** function for Accessories in home page  */
  getAccessories() {
    this.service.getBrandAccessories().subscribe(resp => {
      this.accessories = resp["data"];
    });
  }
  /** function for categoryInfo show the details of subcategories in home page  */
  categoryInfo(data: any) {
    this.service.getCategoryList(data["sub_category_id"]).subscribe(resp => {
      this.categoryData = resp["data"];
      this.service.selectedBrandName.next(resp);
      let i = 0;
      this.categoryData[i]["checkDiscount"] = "categoriesDiscount";
      // for (let i = 0; i < this.categoryData.length; i++) {
      window.open(
        "#/product/" +
          this.categoryData[i]["name"] +
          "/" +
          this.categoryData[i]["sub_category_id"],
        "_self"
      );
      // }
    });
  }
  /** function for accessoriesInfo show the details of  accessories in home page  */
  accessoriesInfo(data: any) {
    this.service
      .getAccessoriesList(data["sub_category_id"])
      .subscribe((resp: any) => {
        this.accessoriesData = resp.data;
        this.service.selectedBrandName.next(resp);
        let i = 0;
        //  for (let i = 0; i < this.accessoriesData.length; i++) {
        this.accessoriesData[i]["checkDiscount"] = "accessoriesDiscount";
        window.open(
          "#/product/" +
            this.accessoriesData[i]["name"] +
            "/" +
            this.accessoriesData[i]["sub_category_id"] +
            "?productCategory=true&id=" +
            data["sub_category_id"],
          "_self"
        );
        // }
        this.service.getSelectedBrand.subscribe(resp => {});
      });
  }

  /** function for  brandOfferInfo show the details of  brandOffer in home page  */
  brandOfferInfo(data: any) {
    this.service.getBrandOfferList(data["brand_id"]).subscribe(resp => {
      this.brandOfferData = resp["data"];
      this.service.selectedBrandName.next(resp);
      let i = 0;
      //  for (let i = 0; i < this.brandOfferData.length; i++) {
      this.brandOfferData[i]["checkDiscount"] = "brandDiscount";
      this.brandOfferData[i]["dropDownValue"] = false;
      window.open(
        "#/product/" +
          this.brandOfferData[i]["name"] +
          "/" +
          this.brandOfferData[i]["sub_category_id"] +
          "?productCategory=true&id=" +
          data["brand_id"],
        "_self"
      );
      // }
      this.service.getSelectedBrand.subscribe(resp => {});
    });
  }

  /** function for  brandPromotionInfo show the details of brandPromotion in home page  */
  brandPromotionInfo(data: any) {
    this.service.getBrandPromotionList(data).subscribe((resp: any) => {
      if (resp != null) {
        this.brandPromotionData = resp["data"];
        this.service.selectedBrandName.next(resp);
        let i = 0;
        //  for (let i = 0; i < this.brandPromotionData.length; i++) {
        this.brandPromotionData[i]["checkDiscount"] = "promotionDiscount";
        window.open(
          "#/product/" +
            this.brandPromotionData[i]["name"] +
            "/" +
            this.brandPromotionData[i]["sub_category_id"] +
            "?productCategory=true&id=" +
            data,
          "_self"
        );
      }
      this.service.getSelectedBrand.subscribe(resp => {});
      // }
    });
  }

  /** function for  hotDealsInfo show the details of brandPromotion in home page  */
  hotDealsInfo(data: any) {
    this.hotDeals.find(element => {
      if (element.image === data) {
        this.hotDealsId = element.id;
      }
    });

    this.service.getHotDealsList(this.hotDealsId).subscribe((resp: any) => {
      if (resp != null) {
        this.hotDealsData = resp["data"];
        this.service.selectedBrandName.next(resp);
        let i = 0;
        //  for (let i = 0; i < this.hotDealsData.length; i++) {
        this.hotDealsData[i]["checkDiscount"] = "hotDealsDiscount";
        window.open(
          "#/product/" +
            this.hotDealsData[i]["name"] +
            "/" +
            this.hotDealsData[i]["sub_category_id"] +
            "?productCategory=true&id=" +
            data,
          "_self"
        );
        //  }
        this.service.getSelectedBrand.subscribe(resp => {});
      }
    });
  }
}
