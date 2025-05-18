import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  // Sidebar menu items
  menuItems = [
    { icon: 'fa-solid fa-user', active: false },
    { icon: 'fa-solid fa-table-columns', active: true },
    { icon: 'fa-solid fa-book', active: false },
    { icon: 'fa-solid fa-graduation-cap', active: false },
    { icon: 'fa-solid fa-calendar-days', active: false },
    { icon: 'fa-solid fa-users', active: false },
    { icon: 'fa-solid fa-dollar-sign', active: false },
    { icon: 'fa-solid fa-message', active: false },
    { icon: 'fa-solid fa-file', active: false },
    { icon: 'fa-solid fa-circle', active: false }
  ];
}