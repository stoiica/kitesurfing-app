import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { AuthenticationService } from "../authentication.service";
import { AlertService } from "../alert.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private alert: AlertService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.auth.loggedUserId) {
      this.alert.showAlert("Logged In", "succes");

      return true;
    }
    this.alert.showAlert("Log in first", "info");
    this.router.navigate([""]);
    return false;
  }
}
