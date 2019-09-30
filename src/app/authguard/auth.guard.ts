import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticateService } from '../service/authenticate.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private service: AuthenticateService, private router: Router) { }
    canActivate(): boolean {
        if (this.service.loggedIn()) {
            return true;
        } else {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}
