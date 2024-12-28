import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../admins/admin-components/dashboard/dashboard.component';
import { AdminGuard } from 'src/app/auth/guards/admin-guard/admin.guard';
import { PostStudentComponent } from './admin-components/post-student/post-student.component';
import { AllStudentsComponent } from './admin-components/all-students/all-students.component';
import { PayFeeComponent } from './admin-components/pay-fee/pay-fee.component';
import { AllLeavesComponent } from './admin-components/all-leaves/all-leaves.component';

const routes: Routes = [
  {path:'dashboard',component:DashboardComponent,canActivate:[AdminGuard]},
  {path:'createStudent',component:PostStudentComponent,canActivate:[AdminGuard]},
  {path:'allStudents',component:AllStudentsComponent,canActivate:[AdminGuard]},
  {path:'fee/:studenId',component:PayFeeComponent,canActivate:[AdminGuard]},
  {path:'leaves',component:AllLeavesComponent,canActivate:[AdminGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
