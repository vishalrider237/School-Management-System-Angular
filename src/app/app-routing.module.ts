import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NoAuthGuard } from './auth/guards/noAuth-guard/no-auth.guard';
import { OtpSentComponent } from './otp-sent/otp-sent.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';

const routes: Routes = [{path:"login",component:LoginComponent,canActivate:[NoAuthGuard]},
  {path:"home",component:HomeComponent},{path:"admin",loadChildren:()=>import("./modules/admin/admin.module").then(m=>m.AdminModule)}
  ,{path:"student",loadChildren:()=>import("./modules/student/student.module").then(m=>m.StudentModule)},
  { path: 'otp', component:OtpSentComponent,canActivate:[NoAuthGuard]},
  { path: 'update-password', component:UpdatePasswordComponent,canActivate:[NoAuthGuard]},
  { path: '**', redirectTo: '/home' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
