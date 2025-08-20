import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { HeaderComponent } from '../components/header/header.component';
import { RouterModule } from '@angular/router'; // ✅ ADD THIS

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isHighlighted: boolean;
}

interface Student {
  name: string;
  class: string;
  avatar: string;
  percentage: number;
  badge: string;
}

interface Event {
  title: string;
  date: string;
  time: string;
  avatars: string[];
  type: 'meeting' | 'vacation' | 'staff' | 'admission';
}

interface ClassPerformance {
  name: string;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  // Dashboard data
  userName = 'Prof,Naseeb';
  profileData = {
    id: 'T5049861',
    name: 'Henriques Morgan',
    classes: 'IX-A, IX-B & Physics',
  };

  completionPercentage = 95;

  // Classes for today
  todaysClasses = [
    { time: '09:00 - 09:45', class: 'Class V, B', color: 'red' },
    { time: '09:45 - 10:30', class: 'Class IV, C', color: 'red' },
    { time: '11:30 - 12:150', class: 'Class V, A', color: 'blue' },
    { time: '01:30 - 02:15', class: 'Class V, B', color: 'blue' },
    { time: '02:15 - 03:00', class: 'Class III, B', color: 'blue' },
  ];

  // Quick links
  quickLinks = [
    { name: 'Time Table', icon: 'fa-regular fa-calendar', color: 'red' },
    { name: 'Attendance', icon: 'fa fa-clipboard-user', color: 'blue' },
    { name: 'Exam Result', icon: 'fa fa-diamond', color: 'yellow' },
    { name: 'Reports', icon: 'fa-regular fa-clipboard', color: 'green' },
  ];

  // Notice message
  notice = 'There is a staff meeting at 9AM today. Dont forget to Attend!!!';

  currentDate: Date = new Date();
  currentMonth: number;
  currentYear: number;
  days: CalendarDay[] = [];
  weekdays: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
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
    const monthLength = new Date(
      this.currentYear,
      this.currentMonth + 1,
      0
    ).getDate();

    // Get the number of days in the previous month
    const prevMonthLength = new Date(
      this.currentYear,
      this.currentMonth,
      0
    ).getDate();

    // Fill in days from previous month
    for (let i = startingDay - 1; i >= 0; i--) {
      this.days.push({
        date: prevMonthLength - i,
        isCurrentMonth: false,
        isHighlighted: false,
      });
    }

    // Fill in days from current month
    for (let i = 1; i <= monthLength; i++) {
      this.days.push({
        date: i,
        isCurrentMonth: true,
        isHighlighted: this.highlightedDates.includes(i),
      });
    }

    // Fill remaining slots with days from next month
    const totalCells = Math.ceil(this.days.length / 7) * 7;
    let nextMonthDay = 1;
    while (this.days.length < totalCells) {
      this.days.push({
        date: nextMonthDay++,
        isCurrentMonth: false,
        isHighlighted: false,
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

  classPerformances: ClassPerformance[] = [
    { name: 'Class IV, C', percentage: 98, color: '#3b82f6' },
    { name: 'Class III, B', percentage: 96, color: '#3b82f6' },
    { name: 'Class V, A', percentage: 78, color: '#6b7280' },
    { name: 'Class V, B', percentage: 80, color: '#fbbf24' },
  ];

  students: Student[] = [
    {
      name: 'Susan Boswell',
      class: 'III, B',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
      percentage: 94,
      badge: '94%',
    },
    {
      name: 'Richard Mayes',
      class: 'V, A',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      percentage: 94,
      badge: '94%',
    },
    {
      name: 'Veronica Randle',
      class: 'V, B',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      percentage: 87,
      badge: '87%',
    },
  ];

  events: Event[] = [
    {
      title: 'Parents, Teacher Meet',
      date: '15 July 2024',
      time: '09:10AM - 10:50PM',
      avatars: [
        'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      ],
      type: 'meeting',
    },
    {
      title: 'Vacation Meeting',
      date: '07 July 2024 - 07 July 2024',
      time: '09:10AM - 10:50PM',
      avatars: [
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face',
      ],
      type: 'vacation',
    },
    {
      title: 'Staff Meeting',
      date: '10 July 2024',
      time: '09:10AM - 10:50PM',
      avatars: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
      ],
      type: 'staff',
    },
    {
      title: 'Admission Camp',
      date: '10 July 2024',
      time: '09:10AM - 10:50PM',
      avatars: [
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face',
      ],
      type: 'admission',
    },
  ];

  getEventIcon(type: string): string {
    switch (type) {
      case 'meeting':
        return '👥';
      case 'vacation':
        return '🏖️';
      case 'staff':
        return '👥';
      case 'admission':
        return '🎓';
      default:
        return '📅';
    }
  }

  getBadgeClass(badge: string): string {
    return badge === '94%' ? 'badge-green' : 'badge-yellow';
  }

  getEventBorderClass(type: string): string {
    switch (type) {
      case 'meeting':
        return 'border-blue';
      case 'vacation':
        return 'border-red';
      case 'staff':
        return 'border-blue';
      case 'admission':
        return 'border-teal';
      default:
        return 'border-gray';
    }
  }

  syllabusCards = [
    {
      class: 'Class V, B',
      title: "Introduction Note to Physics on Today's Tech",
      progress: 85,
      progressColor: 'green',
    },
    {
      class: 'Class V, A',
      title: 'Biometric & their Working Functionality',
      progress: 45,
      progressColor: 'blue',
    },
    {
      class: 'Class IV, C',
      title: 'Quisque a felis quis Course A-Z',
      progress: 75,
      progressColor: 'green',
    },
    {
      class: 'Class IV, C',
      title: 'Quisque a felis quis Course A-Z',
      progress: 15,
      progressColor: 'red',
    },
    {
      class: 'Class IV, C',
      title: 'Quisque a felis quis Course A-Z',
      progress: 60,
      progressColor: 'blue',
    },
  ];

  noticeItems = [
    {
      type: 'homework',
      title: 'Homework has been Submitted successfully',
      time: '13 Hours Ago',
      icon: '📋',
    },
    {
      type: 'transport',
      title: '"Transport Fees" Paid Successfully',
      time: '13 Hours Ago',
      icon: '🚌',
    },
    {
      type: 'exam',
      title: 'Exam model exam result will be released today',
      time: '24 Hours Ago',
      icon: '📊',
    },
    {
      type: 'homework',
      title: 'Home work added by "Shan" from the Book',
      time: '24 Hours Ago',
      icon: '📋',
    },
    {
      type: 'exam',
      title: 'Leave on 25 May 2024 Approved by "Shan"',
      time: '24 Hours Ago',
      icon: '📊',
    },
  ];

  leaveApplications = [
    {
      type: 'Emergency Leave',
      applied: '17 Jun 2024',
      leave: '15 Jun 2024',
      status: 'Pending',
      statusColor: 'pending',
    },
    {
      type: 'Medical Leave',
      applied: '17 Jun 2024',
      leave: '15 Jun 2024',
      status: 'Approved',
      statusColor: 'approved',
    },
    {
      type: 'Fever',
      applied: '17 Jun 2024',
      leave: '15 Jun 2024',
      status: 'Approved',
      statusColor: 'approved',
    },
    {
      type: 'Stomach Pain',
      applied: '17 Jun 2024',
      leave: '15 Jun 2024',
      status: 'Declined',
      statusColor: 'declined',
    },
  ];

  activityTabs = ['Library', 'Transports', 'Reports', 'Payslip'];
  selectedTab = 'Reports';

  reports = [
    {
      title: 'Class IV, A 1st quarter Result',
      uploadDate: '25 May 2024',
      icon: '📄',
    },
    {
      title: 'Class IV, B 2st quarter Result',
      uploadDate: '21 Apr 2024',
      icon: '📄',
    },
    {
      title: 'Class III, C Assignment',
      uploadDate: '',
      icon: '📄',
    },
  ];

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
