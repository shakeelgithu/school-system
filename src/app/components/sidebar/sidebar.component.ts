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
    { icon: 'fa-solid fa-user', route: '/profile' },
    { icon: 'fa-solid fa-table-columns', route: '/dashboard' },
    { icon: 'fa-solid fa-book', route: '/courses' },
    { icon: 'fa-solid fa-graduation-cap', route: '/certifications' },
    { icon: 'fa-solid fa-calendar-days', route: '/calendar' },
    { icon: 'fa-solid fa-users', route: '/student-dashboard' },
    { icon: 'fa-solid fa-dollar-sign', route: '/payments' },
    { icon: 'fa-solid fa-message', route: '/messages' },
    { icon: 'fa-solid fa-file', route: '/documents' },
    { icon: 'fa-solid fa-circle', route: '/notifications' }
  ];

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}