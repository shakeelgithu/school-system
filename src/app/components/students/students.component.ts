import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms'; // ✅ Add this line



interface Student {
  id: string;
  rollNo: string;
  name: string;
  class: string;
  section: string;
  gender: string;
  status: 'Active' | 'Inactive';
  dateOfJoin: string;
  dob: string;
  profileImage: string;
}



@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent,     FormsModule  ],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent  implements OnInit{

  students: Student[] = [
    {
      id: 'AD#892434',
      rollNo: '35013',
      name: 'Janet',
      class: 'III',
      section: 'A',
      gender: 'Female',
      status: 'Active',
      dateOfJoin: '25 May 2024',
      dob: '10 Jan 2019',
      profileImage: 'assets/images/janet.jpg'
    },
    {
      id: 'AD#892433',
      rollNo: '35012',
      name: 'Jason',
      class: 'IV',
      section: 'B',
      gender: 'Male',
      status: 'Active',
      dateOfJoin: '18 May 2024',
      dob: '19 Aug 2018',
      profileImage: 'assets/images/jason.jpg'
    },
    {
      id: 'AD#892432',
      rollNo: '35011',
      name: 'Kathleen',
      class: 'I',
      section: 'A',
      gender: 'Female',
      status: 'Active',
      dateOfJoin: '27 Feb 2024',
      dob: '22 Mar 2018',
      profileImage: 'assets/images/kathleen.jpg'
    },
    {
      id: 'AD#892431',
      rollNo: '35010',
      name: 'Clifford',
      class: 'I',
      section: 'B',
      gender: 'Male',
      status: 'Inactive',
      dateOfJoin: '13 Feb 2024',
      dob: '11 May 2017',
      profileImage: 'assets/images/clifford.jpg'
    },
    {
      id: 'AD#892430',
      rollNo: '35009',
      name: 'Lisa',
      class: 'II',
      section: 'B',
      gender: 'Female',
      status: 'Active',
      dateOfJoin: '11 Feb 2024',
      dob: '20 Jun 2015',
      profileImage: 'assets/images/lisa.jpg'
    },
    {
      id: 'AD#892429',
      rollNo: '35008',
      name: 'Ralph',
      class: 'III',
      section: 'B',
      gender: 'Male',
      status: 'Active',
      dateOfJoin: '24 Jan 2024',
      dob: '18 Sep 2013',
      profileImage: 'assets/images/ralph.jpg'
    },
    {
      id: 'AD#892428',
      rollNo: '35007',
      name: 'Julie',
      class: 'V',
      section: 'A',
      gender: 'Female',
      status: 'Active',
      dateOfJoin: '19 Jan 2024',
      dob: '25 Nov 2012',
      profileImage: 'assets/images/julie.jpg'
    },
    {
      id: 'AD#892427',
      rollNo: '35006',
      name: 'Ryan',
      class: 'VI',
      section: 'A',
      gender: 'Male',
      status: 'Active',
      dateOfJoin: '08 Jan 2024',
      dob: '26 May 2010',
      profileImage: 'assets/images/ryan.jpg'
    },
    {
      id: 'AD#892426',
      rollNo: '35005',
      name: 'Sarah',
      class: 'VIII',
      section: 'B',
      gender: 'Female',
      status: 'Inactive',
      dateOfJoin: '08 Jan 2024',
      dob: '26 May 2010',
      profileImage: 'assets/images/sarah.jpg'
    }
  ];

  filteredStudents: Student[] = [];
  activeStudents = 1194;
  inactiveStudents = 22;
  totalStudents = 1216;
  showingResults = '1-10 of 656';
  selectedFilter = 'All Students';
  searchTerm = '';
  isSidebarOpen = true;

  ngOnInit() {
    this.filteredStudents = [...this.students];
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  filterStudents(status: string) {
    this.selectedFilter = status;
    if (status === 'All Students') {
      this.filteredStudents = [...this.students];
    } else if (status === 'Active Students') {
      this.filteredStudents = this.students.filter(s => s.status === 'Active');
    } else if (status === 'Inactive Students') {
      this.filteredStudents = this.students.filter(s => s.status === 'Inactive');
    }
  }

  searchStudents() {
    if (!this.searchTerm) {
      this.filteredStudents = [...this.students];
      return;
    }
    
    this.filteredStudents = this.students.filter(student => 
      student.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      student.rollNo.includes(this.searchTerm)
    );
  }

  addStudent() {
    console.log('Add Student clicked');
  }

  exportData() {
    console.log('Export data clicked');
  }

  addFees(studentId: string) {
    console.log('Add fees for student:', studentId);
  }

  viewStudent(studentId: string) {
    console.log('View student:', studentId);
  }

  editStudent(studentId: string) {
    console.log('Edit student:', studentId);
  }

  deleteStudent(studentId: string) {
    console.log('Delete student:', studentId);
  }
}
