import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { StudentService, Student } from '../../services/student.service';

interface DisplayStudent {
  _id: string;
  admissionNumber: string;
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
  imports: [CommonModule, SidebarComponent, HeaderComponent, FormsModule, HttpClientModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
  providers: [StudentService]
})
export class StudentsComponent implements OnInit {

  students: DisplayStudent[] = [];
  filteredStudents: DisplayStudent[] = [];
  activeStudents = 0;
  inactiveStudents = 0;
  totalStudents = 0;
  showingResults = '';
  selectedFilter = 'All Students';
  searchTerm = '';
  isSidebarOpen = true;
  loading = false;
  
  // Modal properties
  isModalOpen = false;
  isEditMode = false;
  editingStudentId = '';
  
  newStudent: Student = {
    name: '',
    fatherName: '',
    photo: '',
    admissionNumber: '',
    classAdmittedIn: '',
    dateOfAdmission: '',
    currentClass: '',
    dateOfBirth: '',
    address: ''
  };

  constructor(
    private router: Router,
    private studentService: StudentService
  ) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.loading = true;
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students = this.mapStudentsToDisplay(data);
        this.filteredStudents = [...this.students];
        this.updateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.loading = false;
      }
    });
  }

  mapStudentsToDisplay(students: Student[]): DisplayStudent[] {
    return students.map(student => ({
      _id: student._id || '',
      admissionNumber: student.admissionNumber,
      rollNo: student.admissionNumber, // Using admission number as roll number
      name: student.name,
      class: student.currentClass,
      section: 'A', // Default section since not in backend model
      gender: 'Male', // Default gender since not in backend model
      status: 'Active' as 'Active' | 'Inactive', // Default status
      dateOfJoin: this.formatDate(student.dateOfAdmission),
      dob: this.formatDate(student.dateOfBirth),
      profileImage: student.photo || 'assets/images/default-avatar.jpg'
    }));
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  updateStats() {
    this.totalStudents = this.students.length;
    this.activeStudents = this.students.filter(s => s.status === 'Active').length;
    this.inactiveStudents = this.students.filter(s => s.status === 'Inactive').length;
    this.showingResults = `1-${Math.min(10, this.totalStudents)} of ${this.totalStudents}`;
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
      student.admissionNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      student.rollNo.includes(this.searchTerm)
    );
  }

  // Modal methods
  addStudent() {
    this.isEditMode = false;
    this.isModalOpen = true;
    this.resetForm();
  }

  editStudent(studentId: string) {
    this.isEditMode = true;
    this.editingStudentId = studentId;
    this.isModalOpen = true;
    
    // Load student data for editing
    this.studentService.getStudentById(studentId).subscribe({
      next: (student) => {
        this.newStudent = {
          name: student.name,
          fatherName: student.fatherName,
          photo: student.photo || '',
          admissionNumber: student.admissionNumber,
          classAdmittedIn: student.classAdmittedIn,
          dateOfAdmission: student.dateOfAdmission.split('T')[0], // Format for date input
          currentClass: student.currentClass,
          dateOfBirth: student.dateOfBirth.split('T')[0], // Format for date input
          address: student.address
        };
      },
      error: (error) => {
        console.error('Error loading student for edit:', error);
      }
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  resetForm() {
    this.newStudent = {
      name: '',
      fatherName: '',
      photo: '',
      admissionNumber: '',
      classAdmittedIn: '',
      dateOfAdmission: '',
      currentClass: '',
      dateOfBirth: '',
      address: ''
    };
    this.editingStudentId = '';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // You can implement file upload logic here
      // For now, just store the file name
      this.newStudent.photo = file.name;
    }
  }

  onSubmit() {
    if (this.isEditMode) {
      // Update existing student
      this.studentService.updateStudent(this.editingStudentId, this.newStudent).subscribe({
        next: (response) => {
          console.log('Student updated successfully:', response);
          this.loadStudents(); // Reload students list
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating student:', error);
        }
      });
    } else {
      // Create new student
      this.studentService.createStudent(this.newStudent).subscribe({
        next: (response) => {
          console.log('Student created successfully:', response);
          this.loadStudents(); // Reload students list
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating student:', error);
        }
      });
    }
  }

  deleteStudent(studentId: string) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(studentId).subscribe({
        next: (response) => {
          console.log('Student deleted successfully:', response);
          this.loadStudents(); // Reload students list
        },
        error: (error) => {
          console.error('Error deleting student:', error);
        }
      });
    }
  }

  viewStudent(studentId: string) {
    // Navigate to student detail page or show detail modal
    console.log('View student:', studentId);
    // this.router.navigate(['/student-detail', studentId]);
  }

  addFees(studentId: string) {
    // Navigate to fees page or show fees modal
    console.log('Add fees for student:', studentId);
    // this.router.navigate(['/fees', studentId]);
  }

  exportData() {
    // Export students data to CSV or Excel
    console.log('Export data clicked');
    const csvData = this.convertToCSV(this.students);
    this.downloadCSV(csvData, 'students.csv');
  }

  convertToCSV(data: DisplayStudent[]): string {
    const headers = ['Admission No', 'Roll No', 'Name', 'Class', 'Section', 'Gender', 'Status', 'Date of Join', 'DOB'];
    const csvRows = [headers.join(',')];
    
    data.forEach(student => {
      const row = [
        student.admissionNumber,
        student.rollNo,
        student.name,
        student.class,
        student.section,
        student.gender,
        student.status,
        student.dateOfJoin,
        student.dob
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }

  downloadCSV(csvData: string, filename: string) {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  getFatherName(studentId: string): string {
    // This method will be used in template to show father's name
    // Since we need to maintain the original data structure
    const originalStudent = this.students.find(s => s._id === studentId);
    // For now returning placeholder, you can enhance this
    return 'Father Name'; // This would come from backend in real implementation
  }
}