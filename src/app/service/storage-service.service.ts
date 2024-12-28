import { Injectable } from '@angular/core';

const USER = "c_user";
const TOKEN = "c_token";

@Injectable({
  providedIn: 'root'
})
export class StorageServiceService {

  constructor() {}

  public saveUser(user: any) {
    window.localStorage.setItem(USER, JSON.stringify(user));
  }

  public saveToken(token: string) {
    window.localStorage.setItem(TOKEN, token);
  }

  static getToken(): string | null {
    return window.localStorage.getItem(TOKEN);
  }

  static getUser(): any {
    const user = window.localStorage.getItem(USER);
    return user ? JSON.parse(user) : null;
  }

  static getUserRole(): string {
    const user = this.getUser();
    return user ? user.role : '';
  }

  static isAdminLoggedIn(): boolean {
    return this.getToken() !== null && this.getUserRole() === 'ADMIN';
  }

  static isStudentLoggedIn(): boolean {
    return this.getToken() !== null && this.getUserRole() === 'STUDENT';
  }

  static hasToken(): boolean {
    return this.getToken() !== null;
  }

  static logout() {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
  }
  static getUserId(){
    const user=this.getUser()
    if(user==null){
      return ''
    }
    console.log(user.UserId)
    return user.UserId;
  }
}
