import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { StorageServiceService } from './storage-service.service';

const BASE_URL = ['https://school-management-java-appreciative-raven-xt.cfapps.us10-001.hana.ondemand.com/'];
export const AUTH_HEADER = 'authorization';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private storage: StorageServiceService
  ) {}

  login(email: string, password: string): Observable<any> {
    return this.http
      .post(
        BASE_URL + 'school/security/authenticate',
        { email, password },
        { observe: 'response' }
      )
      .pipe(
        tap((__) => this.log('User Authentication')),
        map((res: HttpResponse<any>) => {
          // Save user details and token to local storage
          const { UserId, role } = res.body;

          // Save only UserId and role in the storage service
          const user = { UserId, role };
          this.storage.saveUser(user);
          console.log(res.body);  // Log the response body for debugging

          // Extract token from the response body
          const token = res.body.token;
          
          if (token) {
            this.storage.saveToken(token);  // Save token to local storage
          }

          return res;
        })
      );
  }
  log(message: string) {
    console.log(message);
  }
  getStudentCount(): Observable<any> {
    return this.http.get<{ count: number }>(BASE_URL + `api/student/countStudents`).pipe(
      catchError((error) => {
        console.error('Error fetching student count:', error);
        return throwError(() => new Error(error));
      })
    );
  }
  sendOtp(email: string): Observable<any> {
    return this.http
      .get(BASE_URL + `api/student/sendOtp/${email}`)
      .pipe(
        tap(() => this.log('OTP sent to ' + email)),
        catchError((error) => {
          console.error('Error sending OTP:', error);
          return throwError(() => new Error(error));
        })
      );
  }
  validateOtp(otp: string): Observable<any> {
    return this.http
      .get(BASE_URL + `api/student/otpvalidate/${otp}`)
      .pipe(
        tap(() => this.log('OTP sent to ' + otp)),
        catchError((error) => {
          console.error('Error sending OTP:', error);
          return throwError(() => new Error(error));
        })
      );
  }
  updatePassword(email: string, password: string): Observable<any> {
    return this.http
      .put(BASE_URL + `api/student/updatePassowrd/${email}/${password}`, {})
      .pipe(
        tap(() => this.log(`Password updated for ${email}`)),
        catchError((error) => {
          console.error('Error updating password:', error);
          return throwError(() => new Error(error));
        })
      );
  }
  
}
