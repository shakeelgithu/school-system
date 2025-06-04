import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentsComponent } from './components/students/students.component';
import { AddStudentComponent } from './add-student/add-student.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full' // very important
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthModule),
  },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'student-dashboard', component: StudentsComponent },
  { path: 'addstudent', component: AddStudentComponent },
];
