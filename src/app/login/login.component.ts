import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageServiceService } from '../service/storage-service.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup;
  successMessage: string = '';  // To hold success message
  errorMessage: string = '';    // To hold error message

  constructor(
    private service: AuthService,
    private formbuilder: FormBuilder,
    private router:Router,
    private snackbar:MatSnackBar
  ) {}

  ngOnInit() {
    this.loginForm = this.formbuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm?.valid) {
      const email = this.loginForm?.value.email;
      const password = this.loginForm?.value.password;

      this.service.login(email, password).subscribe(
        response => {
          console.log('Login successful', response);
          if(StorageServiceService.isAdminLoggedIn()){
              this.router.navigateByUrl("admin/dashboard")
          }
          else if(StorageServiceService.isStudentLoggedIn()){
            this.router.navigateByUrl("student/dashboard")
          }
        },
        error => {
          console.error('Login failed', error);
          if(error.status==406){
              //  this.errorMessage = 'Login failed. Please check your credentials.';
              this.snackbar.open("User is not active.","Close",{
                duration:5000
              })
          }
          else{
            this.snackbar.open("Login failed. Please check your credentials","Close",{
              duration:5000
            })
          }
        }
      );
    }
  }
}
