/*
*@filename: token-interceptor.service.ts
*@purpose: service interceptor for req & resp
*@author: prashant
@Date: 21th Mar 2019
*/
import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpResponse, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthenticateService } from '../service/authenticate.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class TokenInterceptorService implements HttpInterceptor {
    errorMsg = false;
    errorMessage = '';
    constructor(private injector: Injector, private router: Router) { }
    /* defining interceptor function for modifying the req */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authServices = this.injector.get(AuthenticateService);
        const tokenizedReq = req.clone({
            setHeaders: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                Authorization: `Bearer ${authServices.getToken()}`
            }
        });
        return next.handle(tokenizedReq)
            .pipe(
                tap(event => {
                    if (event instanceof HttpResponse) {
                    }
                }, error => {
                    if (error) {
                        if (error.status === 400) {
                            this.errorMsg = true;
                            this.errorMessage = 'server Bad Request.';
                            this.router.navigate(['/login']);
                            // localStorage.removeItem('token');
                            // localStorage.removeItem('currentUser')
                        } else if (error.status === 401) {
                            this.errorMsg = true;
                            this.errorMessage = 'Unauthorized Access.';
                            this.router.navigate(['/login']);
                            localStorage.removeItem('token');
                            localStorage.removeItem('currentUser')
                        } else if (error.status === 422) {
                            this.errorMsg = true;
                            this.errorMessage = 'Unprocessable Request.';
                        } else if (error.status === 408) {
                            this.errorMsg = true;
                            this.errorMessage = 'Request Timeout.';
                        } else if (error.status === 500) {
                            this.errorMsg = true;
                            this.errorMessage = 'Internal Server Error.';
                        }
                    }
                })
            );
    }
}
