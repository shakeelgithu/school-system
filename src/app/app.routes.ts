
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentsComponent } from './components/students/students.component'; // 👈 import student component

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthModule),
  },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'student-dashboard', component: StudentsComponent } // 👈 student dashboard ka route
];
