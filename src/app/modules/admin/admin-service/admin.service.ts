import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageServiceService } from 'src/app/service/storage-service.service';

const BASE_URL=['https://school-management-java-appreciative-raven-xt.cfapps.us10-001.hana.ondemand.com/']
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http:HttpClient) { }


  addStudent(studentDto:any){
    return this.http.post<[]>(BASE_URL+"api/admin/create",studentDto,{
      headers:this.createAuthorizationHeader(),
    })
  }
  createAuthorizationHeader():HttpHeaders{
    let authHeader:HttpHeaders=new HttpHeaders()
    return authHeader.set(
      'Authorization','Bearer '+StorageServiceService.getToken()
    )
  }
  getAllStudents(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${BASE_URL}api/admin/getAll?page=${page}&size=${size}`, {
      headers: this.createAuthorizationHeader()
    });
  }
  deleteSudent(id:any):Observable<any>{
    return this.http.delete<[]>(BASE_URL+`api/admin/delete/${id}`,{
      headers:this.createAuthorizationHeader()
    })
  }
  getStudents(id:any):Observable<any>{
    return this.http.get<[]>(BASE_URL+`api/admin/get/${id}`,{
      headers:this.createAuthorizationHeader()
    })
    
    }
    updateStudent(studentDto:any){
      return this.http.post<[]>(BASE_URL+"api/admin/update",studentDto,{
        headers:this.createAuthorizationHeader(),
      })
  }
   getStudent():Observable<any>{
      return this.http.get<[]>(BASE_URL+`api/student/get/${StorageServiceService.getUserId()}`,{
        headers:this.createAuthorizationHeader()
      })
      
      }
  payFee(studentId:number,feeDto:any){
    return this.http.post<[]>(BASE_URL+`api/admin/create/${studentId}`,feeDto,{
      headers:this.createAuthorizationHeader(),
    })
  }
  getAllAppliedLeaves():Observable<any>{
    return this.http.get<[]>(BASE_URL+`api/admin/leave/getAll`,{
      headers:this.createAuthorizationHeader()
    })
    
    }
    updateLeave(userId:number,status:number){
      return this.http.put<[]>(BASE_URL+`api/admin/update/${userId}/${status}`,{},{
        headers:this.createAuthorizationHeader(),
      })
  }
  triggerMail(mailData: any): Observable<any> {
    const url = `${BASE_URL}api/admin/sendMail`;
    return this.http.post(url, mailData, {
      headers: this.createAuthorizationHeader(),
    });
  }
  exportAsPDF(): Observable<Blob> {
    return this.http.get(`${BASE_URL}api/admin/exportToPdf`, {
      headers: this.createAuthorizationHeader(),
      responseType: 'blob'  // Important to handle PDF files
    });
  }
  
  exportAsEXCEL(): Observable<Blob> {
    return this.http.get(`${BASE_URL}api/admin/exportToExcel`, {
      headers: this.createAuthorizationHeader(),
      responseType: 'blob'  // Important to handle Excel files
    });
  }
}
