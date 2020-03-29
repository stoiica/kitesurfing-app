import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

export interface UserId {
  id: string;
  userId: string;
}

export interface User {
  id: string;
  createdAt: string;
  name: string;
  avatar: string;
  email: string;
}

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<UserId>(
      "https://5e774573e3fd85001601f758.mockapi.io/login",
      {
        username,
        password
      }
    );
  }

  get loggedUserId() {
    if (localStorage.getItem("userId")) {
      return true;
    } else {
      return false;
    }
  }

  isValidUserId(userId: string) {
    return this.http.get<User>(
      "https://5e774573e3fd85001601f758.mockapi.io/user/" + userId
    );
  }
}
