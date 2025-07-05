// class-promotion.component.ts (FINAL FIXED VERSION)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { StudentService, Student } from '../services/student.service';

interface ClassStudent {
  _id: string;
  name: string;
  fatherName: string;
  admissionNumber: string;
  currentClass: string;
  classAdmittedIn: string;
  dateOfAdmission: string;
  dateOfBirth: string;
  address: string;
  profileImage?: string;
  selected: boolean;
  admissionYear: number;
}

interface ClassData {
  className: string;
  classIndex: number;
  students: ClassStudent[];
}

@Component({
  selector: 'app-class-promotion',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './class-promotion.component.html',
  styleUrls: ['./class-promotion.component.scss'],
  providers: [StudentService]
})
export class ClassPromotionComponent implements OnInit {
  
  availableYears: number[] = [];
  currentYear: number = 2024;
  classesData: ClassData[] = [];
  loading = false;
  allStudents: Student[] = [];
  
  classNames = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  
  constructor(private studentService: StudentService) {}

  ngOnInit() {
    console.log('🚀 Initializing promotion component...');
    this.loadAllStudents();
  }

  loadAllStudents() {
    this.loading = true;
    console.log('📥 Loading all students...');
    
    this.studentService.getStudents().subscribe({
      next: (students) => {
        console.log('✅ Loaded students:', students.length);
        this.allStudents = students;
        this.generateDynamicYears();
        this.setDefaultYear();
        this.processStudentsForCurrentYear();
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error loading students:', error);
        this.loading = false;
        alert('Error loading students. Please try again.');
      }
    });
  }

  generateDynamicYears() {
    const admissionYears = this.allStudents.map(student => {
      const admissionDate = new Date(student.dateOfAdmission);
      return admissionDate.getFullYear();
    });
    
    const uniqueYears = [...new Set(admissionYears)].sort((a, b) => a - b);
    const currentYear = new Date().getFullYear();
    
    for (let i = currentYear; i <= currentYear + 3; i++) {
      if (!uniqueYears.includes(i)) {
        uniqueYears.push(i);
      }
    }
    
    this.availableYears = uniqueYears.sort((a, b) => a - b);
    console.log('📋 Available years:', this.availableYears);
  }

  setDefaultYear() {
    const currentYear = new Date().getFullYear();
    if (this.availableYears.includes(currentYear)) {
      this.currentYear = currentYear;
    } else {
      this.currentYear = this.availableYears[this.availableYears.length - 1];
    }
    console.log(`🎯 Default year set to: ${this.currentYear}`);
  }

  selectYear(year: number) {
    console.log(`🔄 Switching to year: ${year}`);
    this.currentYear = year;
    this.processStudentsForCurrentYear();
  }

  processStudentsForCurrentYear() {
    console.log(`📚 Processing students for year: ${this.currentYear}`);
    
    this.classesData = this.classNames.map((className, index) => ({
      className,
      classIndex: index,
      students: []
    }));

    this.allStudents.forEach(student => {
      const admissionDate = new Date(student.dateOfAdmission);
      const admissionYear = admissionDate.getFullYear();
      
      if (admissionYear === this.currentYear) {
        const classStudent: ClassStudent = {
          _id: student._id || '',
          name: student.name,
          fatherName: student.fatherName,
          admissionNumber: student.admissionNumber,
          currentClass: student.currentClass,
          classAdmittedIn: student.classAdmittedIn,
          dateOfAdmission: student.dateOfAdmission,
          dateOfBirth: student.dateOfBirth,
          address: student.address,
          profileImage: student.photo || student.profileImage,
          selected: false,
          admissionYear: admissionYear
        };

        const classIndex = this.classNames.indexOf(student.currentClass);
        if (classIndex !== -1) {
          this.classesData[classIndex].students.push(classStudent);
        }
      }
    });
    
    console.log(`📊 Total students for ${this.currentYear}:`, this.getTotalStudentsInYear());
  }

  updatePromotions() {
    const selectedCount = this.getSelectedStudentsCount();
    const totalCount = this.getTotalStudentsInYear();
    
    console.log(`🎓 Starting promotion: ${selectedCount}/${totalCount} students`);
    
    if (totalCount === 0) {
      alert('No students found for the selected year.');
      return;
    }

    const nextYear = this.currentYear + 1;
    
    if (!confirm(`Promote ${selectedCount} students from ${this.currentYear} to ${nextYear}?`)) {
      return;
    }

    this.loading = true;
    this.executePromotionProcess();
  }

  executePromotionProcess() {
    console.log('⚙️ Executing promotion process...');
    
    const promotionData: { student: ClassStudent, newClass: string, isPromoted: boolean }[] = [];

    this.classesData.forEach((classData, classIndex) => {
      classData.students.forEach(student => {
        if (student.selected) {
          const nextClass = this.getNextClass(classIndex);
          promotionData.push({
            student: student,
            newClass: nextClass,
            isPromoted: true
          });
        } else {
          promotionData.push({
            student: student,
            newClass: student.currentClass,
            isPromoted: false
          });
        }
      });
    });

    console.log(`📋 Processing ${promotionData.length} students`);
    this.createNextYearRecords(promotionData);
  }

  createNextYearRecords(promotionData: { student: ClassStudent, newClass: string, isPromoted: boolean }[]) {
    console.log('🏗️ Creating next year records...');
    
    let processedCount = 0;
    let successCount = 0;
    let promotedCount = 0;
    let stayedCount = 0;

    const nextYear = this.currentYear + 1;
    const nextYearDate = `${nextYear}-01-15`;

    promotionData.forEach(({ student, newClass, isPromoted }, index) => {
      console.log(`\n🔄 Processing ${index + 1}/${promotionData.length}: ${student.name}`);
      
      if (newClass === 'GRADUATED') {
        console.log(`🎓 ${student.name} is graduating`);
        processedCount++;
        if (isPromoted) promotedCount++;
        
        if (processedCount === promotionData.length) {
          this.onPromotionComplete(promotedCount, stayedCount, 0);
        }
        return;
      }

      // ✅ FIX: Create complete student object with all required fields
      const newStudentRecord: Student = {
        name: student.name,
        fatherName: student.fatherName,
        photo: student.profileImage || '', // Use empty string if no photo
        profileImage: student.profileImage || '',
        admissionNumber: student.admissionNumber + '-' + nextYear, // ✅ FIX: Make admission number unique
        classAdmittedIn: student.classAdmittedIn, // Keep original admission class
        dateOfAdmission: nextYearDate, // ✅ FIX: Update to next year
        currentClass: newClass, // ✅ FIX: New promoted class
        dateOfBirth: student.dateOfBirth,
        address: student.address
      };

      console.log(`📝 Creating record:`, {
        name: newStudentRecord.name,
        admissionNumber: newStudentRecord.admissionNumber,
        oldClass: student.currentClass,
        newClass: newStudentRecord.currentClass,
        oldDate: student.dateOfAdmission,
        newDate: newStudentRecord.dateOfAdmission,
        isPromoted: isPromoted
      });

      // ✅ FIX: Use createStudent without file parameter
      this.studentService.createStudent(newStudentRecord).subscribe({
        next: (response) => {
          console.log(`✅ SUCCESS: Created record for ${student.name}`);
          
          successCount++;
          processedCount++;
          
          if (isPromoted) {
            promotedCount++;
          } else {
            stayedCount++;
          }
          
          if (processedCount === promotionData.length) {
            this.onPromotionComplete(promotedCount, stayedCount, promotionData.length - successCount);
          }
        },
        error: (error) => {
          console.error(`❌ FAILED: ${student.name} - ${error}`);
          
          processedCount++;
          
          if (processedCount === promotionData.length) {
            this.onPromotionComplete(promotedCount, stayedCount, promotionData.length - successCount);
          }
        }
      });
    });
  }

  onPromotionComplete(promotedCount: number, stayedCount: number, failedCount: number) {
    console.log('🏁 Promotion completed!');
    
    this.loading = false;
    const nextYear = this.currentYear + 1;
    
    let message = `🎉 PROMOTION COMPLETED!\n\n`;
    message += `📊 RESULTS:\n`;
    message += `• ${promotedCount} students promoted\n`;
    message += `• ${stayedCount} students stayed\n`;
    
    if (failedCount > 0) {
      message += `• ${failedCount} failed\n`;
    }
    
    message += `\n💡 Check year ${nextYear} to see new records!`;
    
    alert(message);
    
    // Reload and switch to next year
    setTimeout(() => {
      this.loadAllStudents();
    }, 1000);
    
    setTimeout(() => {
      if (this.availableYears.includes(nextYear)) {
        this.selectYear(nextYear);
        alert(`🎯 Now viewing ${nextYear} students!`);
      }
    }, 3000);
  }

  // Helper methods
  toggleStudent(classIndex: number, studentIndex: number) {
    this.classesData[classIndex].students[studentIndex].selected = 
      !this.classesData[classIndex].students[studentIndex].selected;
  }

  toggleAllInClass(classIndex: number, selectAll: boolean) {
    this.classesData[classIndex].students.forEach(student => {
      student.selected = selectAll;
    });
  }

  getSelectedStudentsCount(): number {
    return this.classesData.reduce((total, classData) => {
      return total + classData.students.filter(s => s.selected).length;
    }, 0);
  }

  getSelectedInClass(classIndex: number): number {
    return this.classesData[classIndex].students.filter(s => s.selected).length;
  }

  getNextClass(currentClassIndex: number): string {
    if (currentClassIndex < this.classNames.length - 1) {
      return this.classNames[currentClassIndex + 1];
    }
    return 'GRADUATED';
  }

  getImageUrl(filename: string): string {
    if (!filename) return '';
    return this.studentService.getImageUrl(filename);
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/default-avatar.jpg';
  }

  getTotalStudentsInYear(): number {
    return this.classesData.reduce((total, classData) => {
      return total + classData.students.length;
    }, 0);
  }

  getStudentsCountInYear(year: number): number {
    return this.allStudents.filter(student => {
      const admissionDate = new Date(student.dateOfAdmission);
      return admissionDate.getFullYear() === year;
    }).length;
  }

  getYearButtonTooltip(year: number): string {
    const count = this.getStudentsCountInYear(year);
    return `${count} students with admission year ${year}`;
  }
}