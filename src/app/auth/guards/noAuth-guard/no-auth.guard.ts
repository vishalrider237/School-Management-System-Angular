import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageServiceService } from 'src/app/service/storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    if (StorageServiceService.hasToken()) {
      if (StorageServiceService.isStudentLoggedIn()) {
        this.router.navigateByUrl("/student/dashboard");
        return false;
      } else if (StorageServiceService.isAdminLoggedIn()) {
        this.router.navigateByUrl("/admin/dashboard");
        return false;
      }
    }
    return true;
  }
}
