import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StudentService } from 'src/app/modules/student/student-service/student.service';
import { StorageServiceService } from 'src/app/service/storage-service.service';
import { UpdatedialogComponent } from '../updatedialog/updatedialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  student:any
  userRole: string = 'Student';
  constructor(private service:StudentService, private dialog: MatDialog){}
  ngOnInit(){
    this.getStudentById()
    this.setUserRole();
  }
  getStudentById() {
    this.service.getStudents().subscribe((res: any) => {
      if (res) {
        this.student = res;  // Directly assign the response to student object.
        console.log(this.student);  // Check the console for the response structure.
      }
    });
  }

  setUserRole() {
    const roleFromStorage = StorageServiceService.getUserRole()
    this.userRole = roleFromStorage || 'Student';  // Default to student
    console.log(this.userRole)
  }
  editStudent(student: any): void {
          const dialogRef = this.dialog.open(UpdatedialogComponent, {
            width: '600px',
            data: { id: student.id }, // Pass the student ID to the dialog
          });
        
          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this. getStudentById(); // Refresh the student list if an update occurred
            }
          });
        }
}
