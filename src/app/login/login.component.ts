import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../authentication.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { AlertService } from "../alert.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  userId: Observable<string>;

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private alert: AlertService
  ) {}

  ngOnInit(): void {}

  loginUser(event) {
    event.preventDefault();
    const username: string = (<HTMLInputElement>(
      document.getElementById("username")
    )).value;
    const password: string = (<HTMLInputElement>(
      document.getElementById("password")
    )).value;
    this.auth.login(username, password).subscribe(
      user => {
        localStorage.setItem("userId", user.userId);
        this.router.navigate(["dashboard"]);
      },
      err => {
        this.alert.showAlert("Error occurred", "error");
      }
    );
  }
}
