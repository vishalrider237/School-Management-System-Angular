import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { StorageServiceService } from './service/storage-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isAdminLoggedIn: boolean = false;
  isStudentLoggedIn: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.updateUserLoggedInStatus();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateUserLoggedInStatus();
      }
    });
  }

  private updateUserLoggedInStatus(): void {
    this.isAdminLoggedIn = StorageServiceService.isAdminLoggedIn();
    this.isStudentLoggedIn = StorageServiceService.isStudentLoggedIn();
  }

  logout() {
    console.log('Logging out...');
    StorageServiceService.logout();
    this.updateUserLoggedInStatus(); // Update the status after logout
    this.router.navigate(['/login']);
  }
}
