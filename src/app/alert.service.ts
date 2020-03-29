import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class AlertService {
  constructor() {}

  showAlert(message: string, type: string) {
    let alertDiv = <HTMLElement>document.querySelector(".alert-msg");
    alertDiv.innerHTML = message;
    if (type.toLowerCase() === "success") {
      alertDiv.style.background = "#6BBD6E";
    } else if (type.toLowerCase() === "error") {
      alertDiv.style.background = "#F66359";
    } else if (type.toLowerCase() === "info") {
      alertDiv.style.background = "#47A8F5";
    } else if (type.toLowerCase() === "warning") {
      alertDiv.style.background = "#FFAA2C";
    }
    if (alertDiv.classList.contains("alert-transition")) {
      alertDiv.classList.remove("alert-transition");
      setTimeout(() => {
        alertDiv.classList.add("alert-transition");
      }, 2000);
    }
  }
}
