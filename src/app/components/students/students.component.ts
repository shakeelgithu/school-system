import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { StudentService, Student } from '../../services/student.service';

interface DisplayStudent {
  _id: string;
  admissionNumber: string;
  rollNo: string;
  name: string;
  fatherName: string;
  class: string;
  section: string;
  gender: string;
  status: 'Active' | 'Inactive';
  dateOfJoin: string;
  dob: string;
  profileImage?: string;
  admissionYear?: number;
}

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule, HttpClientModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
  providers: [StudentService]
})
export class StudentsComponent implements OnInit {

  students: DisplayStudent[] = [];
  filteredStudents: DisplayStudent[] = [];
  paginatedStudents: DisplayStudent[] = [];
  activeStudents = 0;
  inactiveStudents = 0;
  totalStudents = 0;
  showingResults = '';
  selectedFilter = 'All Students';
  searchTerm = '';
  isSidebarOpen = true;
  loading = false;
  
  // Pagination properties
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 0;
  
  // Add sorting properties
  selectedSort = 'All Students';
  availableYears: number[] = [];
  
  // Modal properties
  isModalOpen = false;
  isEditMode = false;
  editingStudentId = '';
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  
  newStudent: Student = {
    name: '',
    fatherName: '',
    photo: '',
    profileImage: '',
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

  viewMode: string = 'table';

  toggleView(): void {
    this.viewMode = this.viewMode === 'table' ? 'grid' : 'table';
  }

  loadStudents() {
    this.loading = true;
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students = this.mapStudentsToDisplay(data);
        this.filteredStudents = [...this.students];
        this.updateStats();
        this.extractAndSortYears();
        this.updatePagination();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.loading = false;
      }
    });
  }

  // Pagination methods
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredStudents.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    this.updatePaginatedStudents();
    this.updateShowingResults();
  }

  updatePaginatedStudents() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedStudents = this.filteredStudents.slice(startIndex, endIndex);
  }

  updateShowingResults() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
    const endIndex = Math.min(this.currentPage * this.itemsPerPage, this.filteredStudents.length);
    this.showingResults = `${startIndex}-${endIndex} of ${this.filteredStudents.length}`;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedStudents();
      this.updateShowingResults();
    }
  }

  goToNextPage() {
    this.goToPage(this.currentPage + 1);
  }

  goToPreviousPage() {
    this.goToPage(this.currentPage - 1);
  }

  getVisiblePageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  mapStudentsToDisplay(students: Student[]): DisplayStudent[] {
    return students.map(student => {
      const admissionDate = new Date(student.dateOfAdmission);
      const admissionYear = admissionDate.getFullYear();
      
      return {
        _id: student._id || '',
        admissionNumber: student.admissionNumber,
        rollNo: student.admissionNumber,
        name: student.name,
        fatherName: student.fatherName,
        class: student.currentClass,
        section: 'A',
        gender: 'Male',
        status: 'Active' as 'Active' | 'Inactive',
        dateOfJoin: this.formatDate(student.dateOfAdmission),
        dob: this.formatDate(student.dateOfBirth),
        profileImage: student.photo || student.profileImage || '',
        admissionYear: isNaN(admissionYear) ? new Date().getFullYear() : admissionYear
      };
    });
  }

  extractAndSortYears() {
    const years = [...new Set(
      this.students
        .map(student => student.admissionYear)
        .filter((year): year is number => year !== undefined && year !== null && !isNaN(year))
    )];
    this.availableYears = years.sort((a, b) => b - a);
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
  }

  // FIXED: Combined filter and search logic
  applyFiltersAndSearch() {
    // Start with all students
    let result = [...this.students];
    
    // Apply status filter first
    if (this.selectedFilter === 'Active Students') {
      result = result.filter(s => s.status === 'Active');
    } else if (this.selectedFilter === 'Inactive Students') {
      result = result.filter(s => s.status === 'Inactive');
    }
    
    // Apply year filter if selected
    if (this.availableYears.includes(parseInt(this.selectedSort))) {
      const selectedYear = parseInt(this.selectedSort);
      result = result.filter(student => student.admissionYear === selectedYear);
    }
    
    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      result = result.filter(student => 
        student.name.toLowerCase().includes(searchLower) ||
        student.fatherName.toLowerCase().includes(searchLower) ||
        student.admissionNumber.toLowerCase().includes(searchLower) ||
        student.rollNo.toLowerCase().includes(searchLower) ||
        student.class.toLowerCase().includes(searchLower) ||
        student.section.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    if (this.selectedSort === 'A-Z') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.selectedSort === 'Z-A') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (this.selectedSort === 'Date Added') {
      result.sort((a, b) => new Date(b.dateOfJoin).getTime() - new Date(a.dateOfJoin).getTime());
    }
    
    this.filteredStudents = result;
    this.currentPage = 1;
    this.updatePagination();
  }

  filterStudents(status: string) {
    this.selectedFilter = status;
    this.applyFiltersAndSearch();
  }

  searchStudents() {
    this.applyFiltersAndSearch();
  }

  onSortChange(sortValue: string) {
    this.selectedSort = sortValue;
    this.applyFiltersAndSearch();
  }
  
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        return;
      }
      
      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  getImageUrl(filename: string): string {
    return this.studentService.getImageUrl(filename);
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/default-avatar.jpg';
  }

  addStudent() {
    this.isEditMode = false;
    this.isModalOpen = true;
    this.resetForm();
  }

  editStudent(studentId: string) {
    this.isEditMode = true;
    this.editingStudentId = studentId;
    this.isModalOpen = true;
    
    this.studentService.getStudentById(studentId).subscribe({
      next: (student) => {
        this.newStudent = {
          name: student.name,
          fatherName: student.fatherName,
          photo: student.photo || '',
          profileImage: student.profileImage || student.photo || '',
          admissionNumber: student.admissionNumber,
          classAdmittedIn: student.classAdmittedIn,
          dateOfAdmission: student.dateOfAdmission.split('T')[0],
          currentClass: student.currentClass,
          dateOfBirth: student.dateOfBirth.split('T')[0],
          address: student.address
        };
        
        if (student.photo || student.profileImage) {
          this.imagePreview = this.getImageUrl(student.photo || student.profileImage || '');
        }
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
      profileImage: '',
      admissionNumber: '',
      classAdmittedIn: '',
      dateOfAdmission: '',
      currentClass: '',
      dateOfBirth: '',
      address: ''
    };
    this.editingStudentId = '';
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onSubmit() {
    if (this.isEditMode) {
      this.studentService.updateStudent(this.editingStudentId, this.newStudent, this.selectedFile || undefined).subscribe({
        next: (response) => {
          console.log('Student updated successfully:', response);
          this.loadStudents();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating student:', error);
        }
      });
    } else {
      this.studentService.createStudent(this.newStudent, this.selectedFile || undefined).subscribe({
        next: (response) => {
          console.log('Student created successfully:', response);
          this.loadStudents();
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
          this.loadStudents();
        },
        error: (error) => {
          console.error('Error deleting student:', error);
        }
      });
    }
  }

  exportData() {
    console.log('Export data clicked');
    const csvData = this.convertToCSV(this.students);
    this.downloadCSV(csvData, 'students.csv');
  }

  convertToCSV(data: DisplayStudent[]): string {
    const headers = ['Admission No', 'Roll No', 'Name', 'Class', 'Section', 'Status', 'Date of Join', 'DOB'];
    const csvRows = [headers.join(',')];
    
    data.forEach(student => {
      const row = [
        student.admissionNumber,
        student.rollNo,
        student.name,
        student.class,
        student.section,
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
    const originalStudent = this.students.find(s => s._id === studentId);
    return originalStudent?.fatherName || 'Father Name';
  }
}