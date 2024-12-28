import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../admin-service/admin.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-post-student',
  templateUrl: './post-student.component.html',
  styleUrls: ['./post-student.component.scss']
})
export class PostStudentComponent {
  registerForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  isLoading = false;
  constructor(private fb: FormBuilder,private service:AdminService) {}
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      fatherName: ['', Validators.required],
      motherName: ['', Validators.required],
      studentClass: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      address: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }
  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Form submitted:', this.registerForm.value); // Log form values
      this.isLoading = true;
  
      const studentDto = this.registerForm.value;
      this.service.addStudent(studentDto).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('API Response:', response); // Log response
          this.successMessage = 'Student created successfully!';
          this.errorMessage = '';
          this.registerForm.reset();
        },
        error: (error) => {
          this.isLoading = false;
          console.error('API Error:', error); // Log error
          this.successMessage = '';
          this.errorMessage = error?.message || 'Failed to create the student.';
        },
      });
    } else {
      console.warn('Invalid form submission'); // Log invalid form submission
      this.errorMessage = 'Please fill out all required fields.';
      this.successMessage = '';
    }
  }
}
