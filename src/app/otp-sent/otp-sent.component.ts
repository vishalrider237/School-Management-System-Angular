import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-otp-sent',
  templateUrl: './otp-sent.component.html',
  styleUrls: ['./otp-sent.component.scss']
})
export class OtpSentComponent {
  email: string = '';
  otp: string = '';
  otpSent: boolean = false;
  otpVerified: boolean = false;

  constructor(private router: Router,private service:AuthService) {}

  // Enable Send OTP button when email is entered
  onEmailChange(): void {
    this.otpSent = false;
    this.otpVerified = false;
  }

  // Send OTP when email is entered
  sendOtp(): void {
    if (this.email) {
      console.log('Sending OTP to', this.email);
      
      this.service.sendOtp(this.email).subscribe({
        next: (response) => {
          console.log('OTP Sent Successfully:', response);
          this.otpSent = true;
        },
        error: (err) => {
          console.error('Error sending OTP:', err);
          this.showError('Failed to send OTP. Please try again later.');
        }
      });
    } else {
      this.showError('Please enter a valid email.');
    }
  }

  // Enable Validate OTP button when OTP is entered
  onOtpChange(): void {
    this.otpVerified = false;
  }

  // Validate OTP and redirect to the password update page
  validateOtp(): void {
    if (this.otp) {
      console.log('Validating OTP...');
      this.service.validateOtp(this.otp).subscribe({
        next: (response) => {
          console.log('OTP Verified:', response);
          this.otpVerified = true;
          setTimeout(() => {
            this.router.navigate(['/update-password'], {
              state: { email: this.email }
            });
          }, 1000);
        },
        error: (err) => {
          console.error('Invalid OTP:', err);
          this.showError('Invalid OTP. Please try again.');
        }
      });
    } else {
      this.showError('Please enter the OTP.');
    }
  }
  private showError(message: string): void {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-popup';
    errorDiv.innerText = message;

    const otpContainer = document.querySelector('.otp-container');
    otpContainer?.appendChild(errorDiv);

    setTimeout(() => {
      errorDiv.remove();
    }, 3000); // Remove after 3 seconds
  }

  // Submit the form (if necessary)
  onSubmit(): void {
    // Handle form submission logic here if required
  }
}
