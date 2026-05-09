import { Routes, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentsComponent } from './components/students/students.component';
import { AddStudentComponent } from './add-student/add-student.component';
import { ClassPromotionComponent } from './class-promotion/class-promotion.component';
import { PaymentComponent } from './components/payment/payment.component';
import { AuthGuard } from './auth.guard';

import {FinanceComponent} from './components/finance/finance.component'
import {CertificateComponent} from './components/certificate/certificate.component'

const noAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  if (token) {
    router.navigate(['/dashboard']); 
    return false;
  }
  return true;
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [noAuthGuard], 
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'student-dashboard',
    component: StudentsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'addstudent',
    component: AddStudentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'class-promotion',
    component: ClassPromotionComponent,
    canActivate: [AuthGuard],
  },
    {
    path: 'payments',
    component: PaymentComponent,
    canActivate: [AuthGuard],
  },
  { path: 'finance', component: FinanceComponent },

  {
  path: 'certificates',
  component: CertificateComponent,
  canActivate: [AuthGuard],
}
];
