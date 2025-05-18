import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { HeaderComponent } from '../components/header/header.component';

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isHighlighted: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  // Dashboard data
  userName = 'Ms.Teena';
  profileData = {
    id: 'T5049861',
    name: 'Henriques Morgan',
    classes: 'IX-A, IX-B & Physics'
  };
  
  completionPercentage = 95;
  
  // Classes for today
  todaysClasses = [
    { time: '09:00 - 09:45', class: 'Class V, B', color: 'red' },
    { time: '09:45 - 10:30', class: 'Class IV, C', color: 'red' },
    { time: '11:30 - 12:150', class: 'Class V, A', color: 'blue' },
    { time: '01:30 - 02:15', class: 'Class V, B', color: 'blue' },
    { time: '02:15 - 03:00', class: 'Class III, B', color: 'blue' }
  ];
  
  // Quick links
  quickLinks = [
    { name: 'Time Table', icon: 'fa-regular fa-calendar', color: 'red' },
    { name: 'Attendance', icon: 'fa fa-clipboard-user', color: 'blue' },
    { name: 'Exam Result', icon: 'fa fa-diamond', color: 'yellow' },
    { name: 'Reports', icon: 'fa-regular fa-clipboard', color: 'green' }
  ];

  // Notice message
  notice = 'There is a staff meeting at 9AM today. Dont forget to Attend!!!';


  currentDate: Date = new Date();
  currentMonth: number;
  currentYear: number;
  days: CalendarDay[] = [];
  weekdays: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Highlighted dates (similar to what's shown in the image)
  highlightedDates: number[] = [6, 7, 12, 18];

  constructor() {
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
  }

  ngOnInit(): void {
    this.generateCalendar();
  }

  generateCalendar(): void {
    this.days = [];
    
    // Get the first day of the month
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const startingDay = firstDay.getDay();
    
    // Get the number of days in the month
    const monthLength = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    
    // Get the number of days in the previous month
    const prevMonthLength = new Date(this.currentYear, this.currentMonth, 0).getDate();
    
    // Fill in days from previous month
    for (let i = startingDay - 1; i >= 0; i--) {
      this.days.push({
        date: prevMonthLength - i,
        isCurrentMonth: false,
        isHighlighted: false
      });
    }
    
    // Fill in days from current month
    for (let i = 1; i <= monthLength; i++) {
      this.days.push({
        date: i,
        isCurrentMonth: true,
        isHighlighted: this.highlightedDates.includes(i)
      });
    }
    
    // Fill remaining slots with days from next month
    const totalCells = Math.ceil(this.days.length / 7) * 7;
    let nextMonthDay = 1;
    while (this.days.length < totalCells) {
      this.days.push({
        date: nextMonthDay++,
        isCurrentMonth: false,
        isHighlighted: false
      });
    }
  }

  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  getMonthAndYear(): string {
    return `${this.months[this.currentMonth]} ${this.currentYear}`;
  }
}