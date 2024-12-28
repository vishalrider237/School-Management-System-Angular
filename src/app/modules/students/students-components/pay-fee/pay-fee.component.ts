import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/modules/admin/admin-service/admin.service';
import { Location } from '@angular/common';
import { StorageServiceService } from 'src/app/service/storage-service.service';
@Component({
  selector: 'app-pay-fee',
  templateUrl: './pay-fee.component.html',
  styleUrls: ['./pay-fee.component.scss']
})
export class PayFeeComponent implements OnInit{
  payFeeForm!: FormGroup;
  studentId: number | null = null; 
  showForm: boolean = true;
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  constructor(
    private route: ActivatedRoute, 
    private fb: FormBuilder, 
    private snackBar: MatSnackBar,
    private service: AdminService,
    private location: Location
  ) {}

  isSubmitting: boolean = false;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.studentId=StorageServiceService.getUserId();
    console.log(this.studentId)
    this.initializeForm();
  }

  initializeForm(): void {
    this.payFeeForm = this.fb.group({
      month: ['', Validators.required],
      givenBy: ['', [Validators.required, Validators.minLength(2)]],
      amount: ['', [Validators.required, Validators.min(0)]],
      description: [''],
      createdDate: [new Date(), Validators.required]
    });
  }

  submitFee(): void {
    if (this.payFeeForm.valid && this.studentId) {
      this.isLoading = true;
      const feeDto = this.payFeeForm.value; // Collect the form values to send as the feeDto

      // Call the API using the AdminService
      this.service.payFee(this.studentId, feeDto).subscribe({
        next: (response) => {
          console.log(response);
          this.isLoading = false;
          this.successMessage = 'Fee payment submitted successfully!';
          this.errorMessage = null;
          
          // Clear the success message after 5 seconds
          setTimeout(() => {
            this.successMessage = null;
          }, 5000);

          this.payFeeForm.reset({ createdDate: new Date() });
        },
        error: (error) => {
          this.isLoading = false;
          this.successMessage = null;
          this.errorMessage = 'There was an error processing your fee payment. Please try again.';
          
          // Clear the error message after 5 seconds
          setTimeout(() => {
            this.errorMessage = null;
          }, 5000);
        },
      });
    } else {
      this.errorMessage = 'Please fill in all required fields.';
      this.successMessage = null;
      
      // Clear the error message after 5 seconds
      setTimeout(() => {
        this.errorMessage = null;
      }, 5000);
    }
  }

  cancel(): void {
    this.showForm = false;
    this.successMessage = null;
    this.errorMessage = null;
    this.location.back();
  }
}
