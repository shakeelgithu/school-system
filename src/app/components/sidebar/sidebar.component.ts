import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  constructor(private router: Router) {}

  menuItems = [

  { icon: 'fa-solid fa-user', route: '/profile', name: 'Profile' },
  { icon: 'fa-solid fa-table-columns', route: '/dashboard', name: 'Dashboard' },
  { icon: 'fa-solid fa-book', route: '/courses', name: 'Courses' },
  { icon: 'fa-solid fa-graduation-cap', route: '/certifications', name: 'Certifications' },
  { icon: 'fa-solid fa-calendar-days', route: '/calendar', name: 'Calendar' },
  { icon: 'fa-solid fa-users', route: '/student-dashboard', name: 'Student Dashboard' },
  { icon: 'fa-solid fa-dollar-sign', route: '/payments', name: 'Payments' },
  { icon: 'fa-solid fa-message', route: '/messages', name: 'Messages' },
  { icon: 'fa-solid fa-file', route: '/documents', name: 'Documents' },
  { icon: 'fa-solid fa-circle', route: '/notifications', name: 'Notifications' }


  ];

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}