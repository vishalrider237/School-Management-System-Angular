import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UpdatedialogComponent } from 'src/app/modules/admin/admin-components/updatedialog/updatedialog.component';
import { AdminService } from 'src/app/modules/admin/admin-service/admin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  student:any
    constructor(private service:AdminService, private dialog: MatDialog){}
    ngOnInit(){
      this.getStudentById()
    }
    getStudentById() {
      this.service.getStudent().subscribe((res: any) => {
        if (res) {
          this.student = res;  // Directly assign the response to student object.
          console.log(this.student);  // Check the console for the response structure.
        }
      });
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
