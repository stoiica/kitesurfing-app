import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "../authentication.service";
import { AlertService } from "../alert.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    const avatar = <HTMLImageElement>(
      document.querySelector(".user-avatar > img")
    );
    this.auth.isValidUserId(localStorage.getItem("userId")).subscribe(
      user => (avatar.src = user.avatar),
      err => {
        this.alert.showAlert(err, "error");
      }
    );
  }

  toggleNav() {
    const nav = document.querySelector(".avatar-nav");
    if (nav.classList.contains("hide-content")) {
      nav.classList.remove("hide-content");
    } else {
      nav.classList.add("hide-content");
    }
  }

  logoutUser() {
    localStorage.removeItem("userId");
    localStorage.removeItem("markers");
    this.alert.showAlert("Logged Out", "success");
    this.router.navigate([""]);
  }
}
