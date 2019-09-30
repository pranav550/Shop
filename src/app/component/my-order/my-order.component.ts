import { Component, OnInit } from '@angular/core';
import { GeneralService } from './../../service/general.service';
import { HelperCommon } from './../../helper/helpercommon';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { formatDate, DatePipe } from '@angular/common';
import { ToastrManager } from 'ng6-toastr-notifications';
declare var $: any;

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css'],
})
export class MyOrderComponent implements OnInit {
  orderData = [];
  orderInfo: any;
  ratingStars: any;
  ratings: number;
  selectedId: any;
  userInfo: any;
  successMessage: string;
  successMsg: boolean;
  loading: boolean;
  feedbackForm: FormGroup;
  modalRating: any;
  feedbackStatus: boolean;
  postedDate: any;
  deliveryDate: any;
  returnDate: any
  // wraDisabled: boolean = false;


  constructor(private service: GeneralService, private fb: FormBuilder, public toastr: ToastrManager) { }

  ngOnInit() {
    this.getUserOrders();
    this.feedbackValidations();
    this.userInfo = HelperCommon.getUser();
    // this.ratingStars = new Array(5).fill({ status: false });
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

  /**function getUserOrders for getting the user orders */
  getUserOrders() {
    this.feedbackForm = new FormGroup({
      rating: new FormControl(''),
      title: new FormControl(''),
      review: new FormControl(''),
    });

    this.postedDate = formatDate(new Date(), 'EEE, dd MMM yy', 'en');

    this.service.getUserOrder().subscribe(resp => {
      this.orderData = resp['data'];
      console.log(this.orderData)

      /** logic for adding delivery date, return date and rating status*/
      this.orderData.filter((val: any, index: number) => {
        let dt = val.ordered_at;
        let pattern = /(\d{2})\-(\d{2})\-(\d{4})/;
        let orderedDate = new Date(dt.replace(pattern, '$3-$2-$1'));
        this.deliveryDate = formatDate(new Date(orderedDate).setDate(new Date(orderedDate).getDate() + 3), 'dd-MMMM-yyyy', 'en');
        this.returnDate = formatDate(new Date(orderedDate).setDate(new Date(orderedDate).getDate() + 18), 'dd-MMMM-yyyy', 'en');
        val.delivery_date = {};
        val.return_date = {};
        val.delivery_date = this.deliveryDate;
        val.return_date = this.returnDate;

        if (val.feedback.length > 0) {
          val['ratingStatus'] = [false, false, false, false, false];
          val.ratingStatus.filter(function (newValue: any, index2: number) {
            if (index2 < val.user_product_rating) {
              val.ratingStatus[index2] = true;
            }
            else {
              val.ratingStatus[index2] = false;
            }
          });
        }
        else {
          val['ratingStatus'] = [false, false, false, false, false];
        }

        /** logic for writing a review for one time */        
        let feedbackObj = val.feedback.find(
          x => x.user_id == this.userInfo.id
        )
        val.isReviewDisabled = {};

        if (feedbackObj && feedbackObj.status == true) {
          val.isReviewDisabled = true;
        }
        else {
          val.isReviewDisabled = false;
        }

      });     
    }, error => {
      console.log(error)
    })
  }
  /** function feedbackF() for errors  */
  get feedbackF() {
    return this.feedbackForm.controls;
  }

  /**validation of feedback form */
  feedbackValidations() {
    this.feedbackForm = this.fb.group({
      title: ["", Validators.required],
      review: ["", Validators.required],
    });
  }

  /** function userRating for giving the rating*/
  userRating(item_id, i) {
    var ind = i + 1;
    this.orderData.filter((val: any, index: number) => {
      if (val.order_id === item_id) {
        val.user_product_rating = ind;
        val.ratingStatus.filter(function (newValue: any, index2: number) {
          if (index2 < ind) {
            val.ratingStatus[index2] = true;
          }
          else {
            val.ratingStatus[index2] = false;
          }
        });
      }
    });
  }

  /** function updateUserFeedback for updating the user feedback */
  updateUserFeedback(feedbackForm, id, selected_Id) {
    this.selectedId = selected_Id;
    this.orderData.map((ele) => {
      if (ele && ele.order_id == id) {
        feedbackForm.value.rating = ele.user_product_rating;
        ele.isReviewDisabled=true;
      }
    });

    try {
      this.loading = true;
      this.successMsg = false;
      let data = {
        feedback: [{
          rating: feedbackForm.value.rating,
          review: feedbackForm.value.review,
          posted_date: this.postedDate,
          status: true,
          review_title: feedbackForm.value.title,
          user_id: this.userInfo.id,
          user_name: this.userInfo.name
        }]
      }
      this.service.updateFeedback(data, this.selectedId).subscribe(resp => {
        this.loading = false;
        this.successMsg = true;
        this.successMessage = "You have successfully rated this product."
      }, error => {
        this.loading = false;
        console.log(error)
      })
    } catch (excep) {
      console.log(excep)
    }
  }


  /**function open for sending data to write a review modal */
  open(data) {
    this.orderInfo = data;    
  }

  /**function closeModalDialog for closing write a review modal */
  closeModalDialog(item_id) {    
    $("#wraReview").modal("hide");
    this.showToast('You have successfully rated this product', 'Success!')
    
    }
  }

