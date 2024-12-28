import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../admin-service/admin.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-pay-fee',
  templateUrl: './pay-fee.component.html',
  styleUrls: ['./pay-fee.component.scss'],
})
export class PayFeeComponent {
  payFeeForm!: FormGroup;
  studentId: number | null = null; 
  showForm: boolean = true;
  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  constructor( private route: ActivatedRoute,private fb: FormBuilder, private snackBar: MatSnackBar,private service:AdminService,private location: Location) {}
  isSubmitting: boolean = false;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.studentId = +params.get('studenId')!;  // Get the 'id' parameter and convert to number
      if (this.studentId) {
        this.initializeForm();
      }
    });
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
          this.payFeeForm.reset({ createdDate: new Date() });
        },
        error: (error) => {
          this.isLoading = false;
          this.successMessage = null;
          this.errorMessage = 'There was an error processing your fee payment. Please try again.';
        },
      });
    } else {
      this.errorMessage = 'Please fill in all required fields.';
      this.successMessage = null;
    }
  }
  
  cancel(): void {
    this.showForm = false;
    this.successMessage = null;
    this.errorMessage = null;
    this.location.back();
  }
}
