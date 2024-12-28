import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  passwordChangeSuccess: boolean = false;
  passwordChangeError: boolean = false;
  constructor(private router: Router,private authservice:AuthService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const state = navigation.extras.state as { email: string };
      this.email = state.email;
      console.log(this.email)
    }
  }
  onSubmit() {
    if (this.newPassword === this.confirmPassword) {
      this.authservice.updatePassword(this.email, this.newPassword).subscribe({
        next: () => {
          this.passwordChangeSuccess = true;
          this.passwordChangeError = false;
          setTimeout(() => {
            this.passwordChangeSuccess = false;
            this.router.navigateByUrl("/login");
          }, 5000);
        },
        error: (err) => {
          console.error('Password update failed:', err);
          this.passwordChangeError = true;
          this.passwordChangeSuccess = false;
          setTimeout(() => {
            this.passwordChangeError = false;
          }, 5000);
        }
      });
    } else {
      this.passwordChangeError = true;
      this.passwordChangeSuccess = false;
      setTimeout(() => {
        this.passwordChangeError = false;
      }, 5000);
    }
  }
}
