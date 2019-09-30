import { Component, OnInit } from "@angular/core";
declare var $: any;
import { GeneralService } from "./../../service/general.service";
import { HelperCommon } from "./../../helper/helpercommon";
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl
} from "@angular/forms";
import { ToastrManager } from "ng6-toastr-notifications";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  userInfo: any;
  profileForm: FormGroup;
  userProfile: any;

  constructor(
    private service: GeneralService,
    private fb: FormBuilder,
    public toastr: ToastrManager
  ) {}
  successMsg: boolean = false;
  successMessage: string = "";

  ngOnInit() {
    this.profileForm = this.fb.group({
      name: new FormControl("", Validators.required),
      mobile: new FormControl("", Validators.required),
      email: new FormControl("", Validators.required),
      gender: new FormControl("")
    });
    this.userInfo = HelperCommon.getUser();
    this.getProfile(this.userInfo);
    this.disableProfileSetting();
  }

  /**function showToast for showing different type of notification*/
  showToast(data, title) {
    switch (title) {
      case "Success!": {
        this.toastr.successToastr(data, title, {
          position: "top-right",
          toastTimeout: 2000,
          dismiss: "click",
          animate: "slideFromTop",
          titleClass: "titleMsg"
        });
        break;
      }
      case "Warning!": {
        console.log("Fair");
        this.toastr.warningToastr(data, title, {
          position: "top-right",
          toastTimeout: 2000,
          dismiss: "click",
          animate: "slideFromTop",
          titleClass: "titleMsg"
        });
        break;
      }
      case "Error!": {
        console.log("Fair");
        this.toastr.errorToastr(data, title, {
          position: "top-right",
          toastTimeout: 2000,
          dismiss: "click",
          animate: "slideFromTop",
          titleClass: "titleMsg"
        });
        break;
      }
    }
  }

  /**function ProfileF for value */
  ProfileF() {
    return this.profileForm.controls;
  }

  /** function for disable profile settings */
  disableProfileSetting() {
    $(".custom-input-control fieldset").prop("disabled", true);
    var hasAttr = $(".custom-input-control input[type=radio]");
    $(hasAttr)
      .parent()
      .addClass("pevent-none");
  }
  enableProfileSettings() {
    $(".custom-input-control fieldset").prop("disabled", false);
    var hasAttr = $(".custom-input-control input[type=radio]");
    $(hasAttr)
      .parent()
      .removeClass("pevent-none");
  }

  /**function getProfile for getting the profile of user based id */
  getProfile(data) {
    this.service.getUserProfile(data["id"]).subscribe(resp => {
      console.log(resp["data"][0].name)
      this.service.userProfile.next(resp["data"][0].name);
      this.userProfile = resp["data"][0];
      this.validateProfile();
      // this.updateProfiile()
      var profile_location = "profile";
      localStorage.setItem("profileUrl", profile_location);
    });
  }

  /**function validateProfile for validation of profile */
  validateProfile() {
    this.profileForm.controls.name.setValue(this.userProfile["name"]),
      this.profileForm.controls.mobile.setValue(this.userProfile["mobile"]),
      this.profileForm.controls.email.setValue(this.userProfile["email"]);
    this.profileForm.controls.gender.setValue(this.userProfile["gender"]);
  }

  /**function updateProfiile for updating the profile */
  updateProfiile() {
    try {
      let data = {
        name: this.profileForm.controls.name.value,
        email: this.profileForm.controls.email.value,
        mobile: this.profileForm.controls.mobile.value,
        gender: this.profileForm.controls.gender.value
      };
      this.service.updateUserProfile(this.userInfo["id"], data).subscribe(
        resp => {
          this.showToast(
            "You have successfully updated the profile.",
            "Success!"
          );
          this.disableProfileSetting();
          this.getProfile(this.userInfo);
          // this.successMsg = true;
          // this.successMessage = "You have successfully updated the profile."
          // setTimeout(() => {
          //   this.successMsg = false;
          // }, 5000);
        },
        error => {
          console.log(error);
        }
      );
    } catch (excep) {
      console.log(excep);
    }
  }

  ngOnDestroy() {
    localStorage.removeItem("profileUrl");
  }
}
