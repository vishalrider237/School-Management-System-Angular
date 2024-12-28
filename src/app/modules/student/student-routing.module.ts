import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../students/students-components/dashboard/dashboard.component';
import { StudentGuard } from 'src/app/auth/guards/student-guard/student.guard';
import { ApplyLeaveComponent } from '../students/students-components/apply-leave/apply-leave.component';
import { PayFeeComponent } from '../students/students-components/pay-fee/pay-fee.component';

const routes: Routes = [
  {path:'dashboard',component:DashboardComponent,canActivate:[StudentGuard]},
  {path:'leave',component:ApplyLeaveComponent,canActivate:[StudentGuard]},
  {path:'payfee',component:PayFeeComponent,canActivate:[StudentGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
