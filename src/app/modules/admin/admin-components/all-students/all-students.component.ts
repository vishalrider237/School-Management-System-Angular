import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../../admin-service/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DeletedialogComponent } from '../deletedialog/deletedialog.component';
import { PostStudentComponent } from '../post-student/post-student.component';
import { UpdatedialogComponent } from '../updatedialog/updatedialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-all-students',
  templateUrl: './all-students.component.html',
  styleUrls: ['./all-students.component.scss']
})
export class AllStudentsComponent implements OnInit{
  students: any[] = []; // Holds the students for the current page
  pageIndex = 0; // Current page index
  pageSize = 8; // Number of records per page
  totalPages = 0; // Total pages
  studentsLoaded = false;
  displayedColumns: string[] = [
    'name', 'email', 'fatherName', 'motherName', 'StudentClass', 'dateOfBirth', 'address', 'gender','feeStatus','actions'
  ];

  constructor(private studentService: AdminService, private dialog: MatDialog,private snackBar: MatSnackBar) {}
  ngOnInit(): void {
    this.loadStudents();
  }
  
  loadStudents() {
    this.studentService.getAllStudents(this.pageIndex, this.pageSize).subscribe(
      (response) => {
        console.log(response)
        const studentData = response.content;
        this.students = studentData;
        this.studentsLoaded=true
        this.students = studentData.map(student => ({
          ...student,
          feeStatus: student.feeStatus ? 'Paid' : 'Unpaid'
        }));
        this.totalPages = response.totalPages;
        this.totalPages = Math.ceil(response.totalElements / this.pageSize);
      },
      (error) => {
        console.error('Error fetching students:', error);
        this.snackBar.open('Failed to load students', 'Close', { duration: 3000 });
      }
    );
  }

  nextPage() {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex++;
      this.loadStudents();
    }
  }

  prevPage() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.loadStudents();
    }
  }
 
  openDeleteDialog(student: any) {
    const dialogRef = this.dialog.open(DeletedialogComponent, {
      width: '300px',
      data: { student }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.deleteStudent(student.id);
      }
    });
  }
  deleteStudent(id: any): void {
    this.studentService.deleteSudent(id).subscribe(
      () => {
        this.snackBar.open('Student deleted successfully', 'Close', { duration: 3000 });
        this.loadStudents(); // Refresh the list after deletion
      },
      (error) => {
        console.error('Error deleting student:', error);
        this.snackBar.open('Failed to delete student', 'Close', { duration: 3000 });
      }
    );
  }
  editStudent(student: any): void {
    const dialogRef = this.dialog.open(UpdatedialogComponent, {
      width: '600px',
      data: { id: student.id }, // Pass the student ID to the dialog
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadStudents(); // Refresh the student list if an update occurred
      }
    });
  }
  payFee(student: any): void {
    console.log(`Pay Fee action triggered for student:`, student);
    // Add fee payment logic here, such as opening a dialog or navigating to a payment page.
  }
  exportAsPDF() {
    this.studentService.exportAsPDF().subscribe(
      (response) => {
        this.downloadFile(response, 'application/pdf', 'students.pdf');
        this.snackBar.open('PDF exported successfully', 'Close', { duration: 3000 });
      },
      (error) => {
        console.error('Error exporting PDF:', error);
        this.snackBar.open('Failed to export PDF', 'Close', { duration: 3000 });
      }
    );
  }
  
  exportAsExcel() {
    this.studentService.exportAsEXCEL().subscribe(
      (response) => {
        this.downloadFile(response, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'students.xlsx');
        this.snackBar.open('Excel exported successfully', 'Close', { duration: 3000 });
      },
      (error) => {
        console.error('Error exporting Excel:', error);
        this.snackBar.open('Failed to export Excel', 'Close', { duration: 3000 });
      }
    );
  }
  private downloadFile(data: any, type: string, filename: string) {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    console.log(filterValue)
    if (filterValue) {
      let searchDto: any = {};
  
      // Check if it's an email pattern
      if (filterValue.includes('@')) {
        searchDto.mail = filterValue;
      } else {
        searchDto.name = filterValue;
      }
      console.log(searchDto)
      this.studentService.searchStudent(searchDto).subscribe(
        (response) => {
          this.students = response;
          console.log(response)
          this.totalPages = Math.ceil(response.totalElements / this.pageSize)
        },
        (error) => {
          console.error('Error searching students:', error);
          this.snackBar.open('Failed to search students', 'Close', { duration: 3000 });
        }
      );
    } else {
      // Reload all students if search is cleared
      this.loadStudents();
    }
  }
}
