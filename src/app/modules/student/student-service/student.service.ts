import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageServiceService } from 'src/app/service/storage-service.service';

const BASE_URL = ['https://school-management-java-appreciative-raven-xt.cfapps.us10-001.hana.ondemand.com/'];
@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private http: HttpClient) {}
  getStudents(): Observable<any> {
    return this.http.get<[]>(
      BASE_URL + `api/student/get/${StorageServiceService.getUserId()}`,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }
  createAuthorizationHeader(): HttpHeaders {
    let authHeader: HttpHeaders = new HttpHeaders();
    return authHeader.set(
      'Authorization',
      'Bearer ' + StorageServiceService.getToken()
    );
  }
  applyLeave(leaveDto: any) {
    return this.http.post<[]>(BASE_URL + 'api/student/leave', leaveDto, {
      headers: this.createAuthorizationHeader(),
    });
  }
   getStudent():Observable<any>{
        return this.http.get<[]>(BASE_URL+`api/student/get/${StorageServiceService.getUserId()}`,{
          headers:this.createAuthorizationHeader()
        })
        
        }
  triggerMail(mailData: any): Observable<any> {
      const url = `${BASE_URL}api/student/sendMail`;
      return this.http.post(url, mailData, {
        headers: this.createAuthorizationHeader(),
      });
    }
}
