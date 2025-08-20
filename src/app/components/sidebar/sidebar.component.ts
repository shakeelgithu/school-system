// sidebar.component.ts (Updated)
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
  sidebarOpen = false;

  constructor(private router: Router) {}

  menuItems = [
    { icon: 'fas fa-user menu-icon', route: '/profile', name: 'Profile' },
    { icon: 'fas fa-table-columns', route: '/dashboard', name: 'Dashboard' },
    { icon: 'fas fa-book', route: '/courses', name: 'Courses' },
    { icon: 'fas fa-graduation-cap', route: '/certifications', name: 'Certifications' },
    { icon: 'fas fa-calendar-days', route: '/calendar', name: 'Calendar' },
    { icon: 'fas fa-users', route: '/student-dashboard', name: 'Student Dashboard' },
    { icon: 'fas fa-user-graduate', route: '/class-promotion', name: 'Class Promotion' }, // New menu item
    { icon: 'fas fa-dollar-sign', route: '/payments', name: 'Payments' },
    { icon: 'fas fa-message', route: '/messages', name: 'Messages' },
    { icon: 'fas fa-file', route: '/documents', name: 'Documents' },
    { icon: 'fas fa-bell', route: '/notifications', name: 'Notifications' }
  ];

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  onMenuClick(route: string): void {
    // Close sidebar on mobile when menu item is clicked
    if (window.innerWidth < 992) {
      this.closeSidebar();
    }
  }

  logout() {
    localStorage.removeItem('token'); // remove token
    this.router.navigate(['/auth/login']); // redirect to login
  }
}