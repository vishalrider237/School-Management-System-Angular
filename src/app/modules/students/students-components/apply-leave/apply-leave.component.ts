import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from 'src/app/modules/student/student-service/student.service';
import { StorageServiceService } from 'src/app/service/storage-service.service';

@Component({
  selector: 'app-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.scss'],
})
export class ApplyLeaveComponent {
  leaveForm: FormGroup;
  isLoading = false; // For showing the loader
  successMessage: string | null = null; // For success message
  errorMessage: string | null = null; // For error message

  constructor(
    private fb: FormBuilder,
    private service: StudentService,
    private router: Router
  ) {
    this.leaveForm = this.fb.group({
      userId: StorageServiceService.getUserId(),
      subject: ['', [Validators.required]],
      body: ['', [Validators.required, Validators.minLength(10)]],
      leavefrom: ['', [Validators.required]], // Add leaveFrom field
      leaveto: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.leaveForm.valid) {
      this.isLoading = true; // Show loader
      this.successMessage = null; // Clear previous messages
      this.errorMessage = null;

      const leaveDto = this.leaveForm.value;
      console.log('Leave dto:', leaveDto);
      // Call the API from StudentService
      this.service.applyLeave(leaveDto).subscribe({
        next: (response) => {
          console.log('API Response:', response);

          // Fetch student details for email
          this.service.getStudent().subscribe({
            next: (studentData) => {
              console.log('response data:', studentData);
              const mailData = {
                body: leaveDto.body,
                name: "Vishal Pandey",
                receiver: 'vishalpandey10022000@gmail.com',
                replyTo: studentData.email,
                sender: studentData.email,
                subject: `New ${leaveDto.subject} Request`,
                notificationType:'leave',
                bestregard:studentData.name
              };
              console.log('mail data:', mailData);
              // Trigger mail
              this.service.triggerMail(mailData).subscribe({
                next: (res) => {
                  console.log('Mail sent:', res);
                  this.successMessage = 'Leave application submitted successfully!';
                  this.autoClearMessages();
                },
                error: (err) => {
                  console.error('Error sending mail:', err);
                  this.errorMessage = 'Failed to send email. Please try again later.';
                  this.autoClearMessages();
                },
              });
              this.leaveForm.reset(); // Reset the form
            },
            error: (err) => {
              console.error('Error fetching student details:', err);
              this.errorMessage = 'Failed to fetch student details. Please try again.';
              this.autoClearMessages();
            },
          });
        },
        error: (error) => {
          console.error('API Error:', error);
          this.errorMessage =
            'Failed to submit leave application. Please try again.';
          this.isLoading = false;
          this.autoClearMessages();
        },
        complete: () => {
          this.isLoading = false; // Hide loader
        },
      });
    } else {
      this.errorMessage = 'Please fill all required fields correctly.';
      this.autoClearMessages();
    }
  }

  autoClearMessages(): void {
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 9000); // Clear messages after 5 seconds
  }
}
