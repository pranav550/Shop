import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CommonConstants } from "./../../constant/constant";
import { WishLish } from "./../models/wishlist";
import { Coupons } from "./../models/coupons";
import { Shopping } from "./../models/shopping";
import { Address } from "./../models/address";
import { AdminList } from "./../models/adminlist";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
@Injectable({
  providedIn: "root"
})
export class GeneralService {
  constructor(private _http: HttpClient) {}

  /*@Purpose: url key for after authentication for data access
   * @author: Prashant
   * @ return : key data
   * @Date: 22th Mar 2019
   */

  /**function getProductCart for getting the product in cart */
  // getProductCart() {
  //     return this._http.get(CommonConstants.ADMINAPIUrl + 'product')
  // }

  dropDown= new BehaviorSubject(false);
  getDropDown=this.dropDown.asObservable();

  /** function getList for getting the list of admin*/
  getProductList(): Observable<AdminList[]> {
    return this._http.get<AdminList[]>(
      CommonConstants.APIUrl + "product_categories"
    );
  }

  /** function getSubcategories for getting the sub categories list when user is login*/
  getSubcategories(id: string, userInfo): Observable<any> {
    return this._http.get(
      CommonConstants.APIUrl + "product/" + id + "/" + userInfo + "/all"
    );
  }

  /** function getSubcategories for getting the sub categories list whwn user is not login */
  getSubcategoriesNotLogin(id: string): Observable<any> {
    return this._http.get(
      CommonConstants.APIUrl + "product/" + id + "/" + 0 + "/all"
    );
  }

  /** function getSubcategories for getting the sub categories list */
  getPagination(id: string, page: number) {
    return this._http.get(
      CommonConstants.APIUrl + "product/" + id + "?page=" + page
    );
  }

  /** function getSimilarTypesItems for getting the similar type of list */
  getSimilarTypesItems(data): Observable<any> {
    return this._http.post(
      CommonConstants.APIUrl + "similar_products_details",
      data
    );
  }

  /** wishlist api integration */

  /**function getWishList for getting the user product*/
  getWishlist(id): Observable<WishLish[]> {
    return this._http.get<WishLish[]>(
      CommonConstants.APIUrl + "wish_list/" + id
    );
  }

  /**function postWishlist for adding the product in wishlist */
  postWishlist(data): Observable<WishLish[]> {
    return this._http.post<WishLish[]>(
      CommonConstants.APIUrl + "wish_list",
      data
    );
  }

  /**function removeWishlist for remove the product from the list*/
  removeWishlist(id): Observable<WishLish[]> {
    return this._http.delete<WishLish[]>(
      CommonConstants.APIUrl + "wish_list/" + id
    );
  }

  /**function deleteWishlist for deselect the product */
  // deleteWishlist(id): Observable<WishLish[]> {
  //     return this._http.delete<WishLish[]>(CommonConstants.APIUrl + 'delete_wish_list/' + id)
  // }

  /** Coupons api Integration */

  /**function getCouponList for getting the list of coupons*/
  getCouponList(): Observable<Coupons[]> {
    return this._http.get<Coupons[]>(CommonConstants.APIUrl + "coupons");
  }

  /**function postCoupon for discount on the product*/
  postCoupon(data): Observable<Coupons[]> {
    return this._http.post<Coupons[]>(
      CommonConstants.APIUrl + "apply_coupon",
      data
    );
  }

  /**function updateFeedback for updating the feedback on the product*/
  updateFeedback(data, id): Observable<any> {
    return this._http.put<any>(CommonConstants.APIUrl + 'user_feedback/' + id, data)
  }

  /**function removeCoupon for remove the coupon from the product*/
  removeCoupon(id): Observable<Coupons[]> {
    return this._http.delete<Coupons[]>(
      CommonConstants.APIUrl + "clear_coupon/" + id
    );
  }

  /** Shopping cart api integration */

  /**function getCartProduct for getting the user product*/
  getCartProduct(id): Observable<Shopping[]> {
    return this._http.get<Shopping[]>(
      CommonConstants.APIUrl + "shopping_cart/" + id
    );
  }
  resp1 = new BehaviorSubject([]);
  getCart = this.resp1.asObservable();

  /**function addCart for adding the product in cart */
  addCart(data) {
    return this._http.post(CommonConstants.APIUrl + "add_to_cart", data);
  }

  /**function removeShoppingCart for remove the product from the cart*/
  removeShoppingCart(id): Observable<Shopping[]> {
    return this._http.delete<Shopping[]>(
      CommonConstants.APIUrl + "shopping_cart/" + id
    );
  }

  /**function updateCart for update the cart */
  updateCart(data, id): Observable<Shopping[]> {
    return this._http.put<Shopping[]>(
      CommonConstants.APIUrl + "shopping_cart/" + id,
      data
    );
  }

  /**function moveWishlistCart for moving the product in cart*/
  // moveWishlistCart(data): Observable<Shopping[]> {
  //     return this._http.post<Shopping[]>(CommonConstants.APIUrl + 'wish_list_to_cart', data)
  // }

  /**Address api integration */

  /**function getUserAddress for getting the user address*/
  getUserAddress(id): Observable<Address[]> {
    return this._http.get<Address[]>(
      CommonConstants.APIUrl + "user_address/" + id
    );
  }

  /**function addAddress for adding the user address */
  addAddress(data): Observable<Address[]> {
    return this._http.post<Address[]>(
      CommonConstants.APIUrl + "add_address",
      data
    );
  }

  /**function removeUserAddress for remove the user address*/
  removeUserAddress(id): Observable<Address[]> {
    return this._http.delete<Address[]>(
      CommonConstants.APIUrl + "delete_address/" + id
    );
  }

  /**function updateUserAddress for update the user address */
  updateUserAddress(id, data): Observable<Address[]> {
    return this._http.put<Address[]>(
      CommonConstants.APIUrl + "update_address/" + id,
      data
    );
  }

  /**function getUserAddress for getting the user address on based of selection*/
  getUserAddressIndivdual(id, address_id): Observable<Address[]> {
    return this._http.get<Address[]>(
      CommonConstants.APIUrl +
        "user_individual_address/" +
        id +
        "/" +
        address_id
    );
  }

  /***api for profile */

  /**function getUserProfile for getting the profile */
  getUserProfile(id) {
    return this._http.get(CommonConstants.APIUrl + "user_profile/" + id);
  }

  userProfile = new BehaviorSubject([]);
  userProfileData = this.userProfile.asObservable();

  /**function updateUserProfile for update the user profile */
  updateUserProfile(id, data): Observable<Address[]> {
    return this._http.put<Address[]>(
      CommonConstants.APIUrl + "user_update/" + id,
      data
    );
  }

  /**function postPayment for posting the payment */
  postPayment(data) {
    return this._http.post(CommonConstants.APIUrl + "stripe_payment", data);
  }

  /**function getUserOrder for getting the user order */
  getUserOrder() {
    return this._http.get(CommonConstants.APIUrl + "my_orders");
  }

  /**function notifyUser for notification when product is available */
  notifyUser(data) {
    return this._http.post(CommonConstants.APIUrl + "notify_me", data);
  }

  /**function getStates for getting the state */
  getStates() {
    return this._http.get(CommonConstants.APIUrl + "get_states");
  }

  /**function postProduct display the product on the basis of color and size */
  postProduct(data) {
    return this._http.post(CommonConstants.APIUrl + "selected_products", data);
  }
  /**function for recently viewed on product page */
  recentlyViewed(id) {
    return this._http.get(CommonConstants.APIUrl + "recently_viewed/" + id);
  }

  postRecentlyViewed(data) {
    return this._http.post(CommonConstants.APIUrl + "recently_viewed", data);
  }
  deleteRecentlyViewedItems(id): Observable<any>{
    return this._http.delete<any>(CommonConstants.APIUrl + "recently_viewed/" + id);
  }

  /***api for home page */

  /**function for list of categories on home page */
  getProductCategory(): Observable<any> {
    return this._http.get(CommonConstants.APIUrl + "category_offer/web");
  }

  /**function for list of brand promotion in home page */
  getBrandPromotion(): Observable<any> {
    return this._http.get(CommonConstants.APIUrl + "brand_promotions/web");
  }

  /**function for list of brand offer in home page */
  getBrandOffer(): Observable<any> {
    return this._http.get(CommonConstants.APIUrl + "brand_offer/web");
  }

  /**function for list of brand accessories in home page */
  getBrandAccessories(): Observable<any> {
    return this._http.get(CommonConstants.APIUrl + "accessories/web");
  }

  /**function for list of brand accessories in home page */
  getBrandHotDeals(): Observable<any> {
    return this._http.get(CommonConstants.APIUrl + "hot_deal/web");
  }

  /**variable for update the wishlist count in behavior */
  wishlistUpdateCount = new BehaviorSubject<number>(0);
  updatedWishlist = this.wishlistUpdateCount.asObservable();

  /**function updateWishlistCount for updated the wishlist count */
  updateWishlistCount(count) {
    this.wishlistUpdateCount.next(count);
  }

  /**variable for update the shopping cart count in behavior */
   shoppingCartUpdateCount = new BehaviorSubject<number>(0);
  updatedShoppingCart = this.shoppingCartUpdateCount.asObservable();

  /**function updateShoppingCartCount for updated the wishlist count */
  updateShoppingCartCount(count) {
    this.shoppingCartUpdateCount.next(count);
  }

  /**function for searching in home page */
  getSearch(id, data): Observable<any> {
    return this._http.get(CommonConstants.APIUrl + "search/" + id + "/" + data);
  }

  /**function for searching in home page */
  getSearchDetail(id): Observable<any> {
    return this._http.get(
      CommonConstants.APIUrl + "products_after_search/" + id
    );
  }

  /**function for get product list */
  getProduct(): Observable<any> {
    return this._http.get(CommonConstants.APIUrl + "product");
  }

  /**function for subaccesories list  */
  getAccessoriesList(id): Observable<any> {
    return this._http.get(
      CommonConstants.APIUrl + "accessories_products/" + id
    );
  }

  /**function for subcategory list  */
  getCategoryList(id): Observable<any> {
    return this._http.get(
      CommonConstants.APIUrl + "category_offer_products/" + id
    );
  }

  /**function for subHotDeals list  */
  getHotDealsList(id): Observable<any> {
    return this._http.get(CommonConstants.APIUrl + "hot_deal_products/" + id);
  }

  /**function for showing Brand Offer */
 

  selectedBrandName = new BehaviorSubject([]);
  getSelectedBrand = this.selectedBrandName.asObservable();

  /**function for BrandOfferList list  */
  getBrandOfferList(id): Observable<any> {
    return this._http.get(
      CommonConstants.APIUrl + "brand_offer_products/" + id
    );
  }

  /**function for Brand Promotion List list  */
  getBrandPromotionList(id): Observable<any> {
    return this._http.get(
      CommonConstants.APIUrl + "brand_promotions_products/" + id
    );
  }

  /**filter Api  */
  /**function for filter list  */
  getProductFilterList(id): Observable<any> {
    return this._http.get(CommonConstants.APIUrl + "filter_list/" + id);
  }
  /**function for Apply filter list  */
  getApplyProductFilter(group_id, id, data): Observable<any> {
    return this._http.post(
      CommonConstants.APIUrl + "products_filter/" + group_id + "/" + id,
      data
    );
  }
  /**function for Sorting filter list  */
  postSortProduct(id, data): Observable<any> {
    return this._http.post(CommonConstants.APIUrl + "sort/" + id, data);
  }
}
