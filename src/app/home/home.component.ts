import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  studentCount = 0;
  targetCount = 0;
  

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchStudentCount();
   
  }
  fetchStudentCount(): void {
    this.authService.getStudentCount().subscribe(
      (response) => {
        console.log('Student count fetched:', response);  // Debugging line
        this.targetCount = response;
        console.log('Target count:', this.targetCount);  // Debugging line
        this.animateCount();
      },
      (error) => {
        console.error('Error fetching student count', error);  // Handle error
      }
    );
  }

  animateCount(): void {
    const interval$ = interval(50); // Run every 50ms
    const subscription = interval$.subscribe(() => {
      if (this.studentCount < this.targetCount) {
        this.studentCount++;  // Increment by 1
      } else {
        this.studentCount = this.targetCount;  // Ensure it reaches the exact target
        subscription.unsubscribe();
      }
    });
  }

}
