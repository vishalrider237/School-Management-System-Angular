import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../admin-service/admin.service';

@Component({
  selector: 'app-all-leaves',
  templateUrl: './all-leaves.component.html',
  styleUrls: ['./all-leaves.component.scss'],
})
export class AllLeavesComponent implements OnInit {
  appliedLeaves: any[] = []; // Store the applied leaves data
  isLoading = false;
  successMessage: string | null = null; // For success message
  errorMessage: string | null = null; // For error message

  constructor(private adminservice: AdminService) {}

  ngOnInit(): void {
    this.fetchLeaveDetails();
  }

  // Fetch leave details from API
  fetchLeaveDetails(): void {
    this.isLoading = true; // Show loading spinner
    this.adminservice.getAllAppliedLeaves().subscribe({
      next: (response) => {
        this.appliedLeaves = response; // Set the response to the appliedLeaves array
         console.log("leave reponse ",response)
        this.errorMessage = null; // Clear any previous error messages
      },
      error: (error) => {
        console.error('Error fetching applied leaves:', error);
        this.errorMessage = 'Failed to load applied leaves. Please try again.';
      },
      complete: () => {
        this.isLoading = false; // Hide loading spinner
      },
    });
  }

  approveLeave(leave: any): void {
    console.log('Leave id:', leave.userId);
    this.adminservice.updateLeave(leave.userId, 1).subscribe({
      next: (response) => {
        console.log('Leave approved:', response);
        leave.errorMessage = '';
        leave.successMessage = 'Leave approved successfully!';
        leave.leaveStatus = 'Approved';

        // Trigger mail after approval
        const mailData = {
          body: 'Your leave request has been approved.',
          name: leave.name,
          receiver: leave.email,
          replyTo:leave.email,
          sender:"vishalpandey10022000@gmail.com",
          subject: leave.leaveStatus,
          notificationType:"leave",
          bestregard:"School Admin Team"
        };
         console.log("mail data:"+JSON.stringify(mailData))
        this.adminservice.triggerMail(mailData).subscribe({
          next: (res) => console.log('Approval mail sent:', res),
          error: (err) => console.error('Error sending approval mail:', err),
        });

        // Hide message after 5 seconds
        setTimeout(() => {
          leave.successMessage = '';
        }, 5000);
      },
      error: (error) => {
        console.error('Error updating leave:', error);
        leave.errorMessage = 'Failed to approve the leave. Please try again.';

        // Hide error message after 5 seconds
        setTimeout(() => {
          leave.errorMessage = '';
        }, 5000);
      },
    });
  }

  // Reject the leave
  rejectLeave(leave: any): void {
    this.adminservice.updateLeave(leave.userId, 2).subscribe({
      next: (response) => {
        console.log('Leave rejected:', response);
        leave.successMessage = '';
        leave.errorMessage = 'Leave rejected successfully!';
        leave.leaveStatus = 'Rejected';

        // Trigger mail after rejection
        const mailData = {
          body: 'Your leave request has been rejected.',
          name: leave.name,
          receiver: leave.email,
          replyTo:leave.email,
          sender:"vishalpandey10022000@gmail.com",
          subject: leave.leaveStatus,
          notificationType:"leave",
          bestregard:"School Admin Team"
        };

        this.adminservice.triggerMail(mailData).subscribe({
          next: (res) => console.log('Rejection mail sent:', res),
          error: (err) => console.error('Error sending rejection mail:', err),
        });

        // Hide message after 5 seconds
        setTimeout(() => {
          leave.errorMessage = '';
        }, 5000);
      },
      error: (error) => {
        console.error('Error updating leave:', error);
        leave.errorMessage = 'Failed to reject the leave. Please try again.';

        // Hide error message after 5 seconds
        setTimeout(() => {
          leave.errorMessage = '';
        }, 5000);
      },
    });
  }
}
