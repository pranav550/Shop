import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonConstants } from '../../constant/constant';
import { Authentication } from '../models/authentication';
import { HelperCommon } from '../helper/helpercommon';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(private _http: HttpClient) { }

  /*@Purpose: url key for authentication
	 * @author: Prashant
	 * @ return : key data
	 * @Date: 21th Mar 2019
	 */

  /**function registrationUser for registration the user */
  registrationUser(data): Observable<Authentication[]> {
    return this._http.post<Authentication[]>(CommonConstants.APIUrl + 'user/register', data)
  }

  /**funnction otpVerify for verify the otp */
  otpVerify(data): Observable<Authentication[]> {
    return this._http.post<Authentication[]>(CommonConstants.APIUrl + 'verify_otp', data)

  }

  /**funnction ressendOtpVerify for verify the otp */
  ressendOtpVerify(data): Observable<Authentication[]> {
    return this._http.post<Authentication[]>(CommonConstants.APIUrl + 'resend/otp', data)

  }

  /**function loginUser for login the user */
  loginUser(data): Observable<Authentication[]> {
    return this._http.post<Authentication[]>(CommonConstants.APIUrl + 'login', data)
  }

  /**function forgetUser for forget the user email or mobile */
  forgetUser(data): Observable<Authentication[]> {
    return this._http.post<Authentication[]>(CommonConstants.APIUrl + 'forgot_password', data)
  }

  /**function resetUser for forget the user email or mobile */
  resetUser(data): Observable<Authentication[]> {
    return this._http.post<Authentication[]>(CommonConstants.APIUrl + 'reset_password', data)
  }

  /**function changeUserPassword for change the password of user email or mobile */
  changeUserPassword(data, id): Observable<Authentication[]> {
    return this._http.put<Authentication[]>(CommonConstants.APIUrl + 'change_password/' + id, data)
  }


  /**function loginSocialGmailUser for login the user with gmail*/
  loginSocialGmailUser(data): Observable<Authentication[]> {
    return this._http.post<Authentication[]>(CommonConstants.APIUrl + 'user/google', data)
  }

  /**function loggedIn for get the token from the localstorage */
  loggedIn() {
    return !!(localStorage.getItem('token'));
  }

  /**function  getToken for get the token from local storage*/
  getToken() {
    return (localStorage.getItem('token'));
  }
}
