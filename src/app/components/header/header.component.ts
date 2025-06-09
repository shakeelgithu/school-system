
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() sidebarToggle = new EventEmitter<void>();
  
  // Current date
  currentDate = new Date();

  // Method to toggle sidebar
  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }
}