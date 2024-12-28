import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminService } from '../../admin-service/admin.service';

@Component({
  selector: 'app-updatedialog',
  templateUrl: './updatedialog.component.html',
  styleUrls: ['./updatedialog.component.scss']
})
export class UpdatedialogComponent implements OnInit{
  constructor(public dialogRef: MatDialogRef<UpdatedialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private fb: FormBuilder,private service:AdminService){}

    registerForm!: FormGroup;
      successMessage = '';
      errorMessage = '';
      isLoading = false;

      ngOnInit(): void {
        this.initializeForm();
        this.loadStudentData();
      }
      initializeForm() {
        this.registerForm = this.fb.group({
          name: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required]],
          fatherName: ['', Validators.required],
          motherName: ['', Validators.required],
          studentClass: ['', Validators.required],
          dateOfBirth: ['', Validators.required],
          address: ['', Validators.required],
          gender: ['', Validators.required]
        });
      }
      formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];  // "1995-05-13"
      }
      loadStudentData() {
        this.service.getStudents(this.data.id).subscribe(
          (student) => {
           
            const formattedDateOfBirth = this.formatDate(student.dateOfBirth);
    
           
            this.registerForm.patchValue({
              ...student,
              dateOfBirth: formattedDateOfBirth
            });
    
            this.isLoading = false;
          },
          (error) => {
            this.errorMessage = 'Failed to load student data';
            this.isLoading = false;
          }
        );
      }
      onSubmit() {
        if (this.registerForm.valid) {
          this.isLoading = true;
          const updatedStudent = { ...this.registerForm.value, id: this.data.id };
          this.service.updateStudent(updatedStudent).subscribe(
            (response) => {
              this.successMessage = 'Student updated successfully';
              this.dialogRef.close(true); // Pass 'true' to indicate successful update
            },
            (error) => {
              this.errorMessage = 'Failed to update student';
              this.isLoading = false;
            }
          );
        }
      }
      onClose() {
        this.dialogRef.close();
      }
}
