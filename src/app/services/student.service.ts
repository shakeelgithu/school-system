// services/student.service.ts (Updated V2)
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Student {
  _id?: string;
  name: string;
  fatherName: string;
  photo?: string;
  profileImage?: string; 
  admissionNumber: string;
  classAdmittedIn: string;
  dateOfAdmission: string;
  currentClass: string;
  dateOfBirth: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentResponse {
  message: string;
  student?: Student;
}

// NEW: Promotion interfaces
export interface PromotionRecordCreate {
  newStudents: Student[];
}

export interface PromotionRecordResponse {
  message: string;
  results: Array<{
    success: boolean;
    student?: Student;
    error?: string;
    studentData?: Student;
  }>;
  summary: {
    successful: number;
    failed: number;
    total: number;
  };
}

export interface AdmissionYearData {
  year: number;
  studentCount: number;
  classesPresent: string[];
}

export interface AdmissionYearsResponse {
  years: AdmissionYearData[];
  totalYears: number;
}

export interface PromotionCheckResponse {
  sourceYear: number;
  targetYear: number;
  sourceStudentCount: number;
  existingPromotionRecords: number;
  hasExistingRecords: boolean;
  duplicateAdmissionNumbers: string[];
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/students`;
  private promotionUrl = `${environment.apiUrl}/promotion`;

  constructor(private http: HttpClient) {}

  // EXISTING METHODS
  
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getStudentById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createStudent(studentData: Student, file?: File): Observable<StudentResponse> {
    const formData = new FormData();
    
    Object.keys(studentData).forEach(key => {
      if (key !== 'photo' && key !== 'profileImage' && studentData[key as keyof Student]) {
        formData.append(key, studentData[key as keyof Student] as string);
      }
    });
    
    if (file) {
      formData.append('photo', file);
    }

    return this.http.post<StudentResponse>(this.apiUrl, formData)
      .pipe(catchError(this.handleError));
  }

  updateStudent(id: string, studentData: Student, file?: File): Observable<StudentResponse> {
    const formData = new FormData();
    
    Object.keys(studentData).forEach(key => {
      if (key !== 'photo' && key !== 'profileImage' && studentData[key as keyof Student]) {
        formData.append(key, studentData[key as keyof Student] as string);
      }
    });
    
    if (file) {
      formData.append('photo', file);
    }

    return this.http.put<StudentResponse>(`${this.apiUrl}/${id}`, formData)
      .pipe(catchError(this.handleError));
  }

  deleteStudent(id: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getImageUrl(filename: string): string {
    if (!filename) return 'assets/images/default-avatar.jpg';
    return `${environment.apiUrl.replace('/api', '')}/uploads/${filename}`;
  }

  // NEW PROMOTION METHODS V2
  
  // Create new promotion records (preserves original records)
  createPromotionRecords(newStudents: Student[]): Observable<PromotionRecordResponse> {
    const request: PromotionRecordCreate = { newStudents };
    return this.http.post<PromotionRecordResponse>(`${this.promotionUrl}/create-promotion-records`, request)
      .pipe(catchError(this.handleError));
  }

  // Get students by admission year
  getStudentsByAdmissionYear(year: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.promotionUrl}/by-admission-year/${year}`)
      .pipe(catchError(this.handleError));
  }

  // Get all admission years with statistics
  getAdmissionYears(): Observable<AdmissionYearsResponse> {
    return this.http.get<AdmissionYearsResponse>(`${this.promotionUrl}/admission-years`)
      .pipe(catchError(this.handleError));
  }

  // Get students by class and admission year
  getStudentsByClassAndYear(className: string, year: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.promotionUrl}/by-class-and-year/${className}/${year}`)
      .pipe(catchError(this.handleError));
  }

  // Get statistics for specific admission year
  getYearStatistics(year: number): Observable<any> {
    return this.http.get(`${this.promotionUrl}/stats/${year}`)
      .pipe(catchError(this.handleError));
  }

  // Check if promotion records already exist
  checkPromotionExists(fromYear: number, toYear: number): Observable<PromotionCheckResponse> {
    return this.http.get<PromotionCheckResponse>(`${this.promotionUrl}/check-promotion/${fromYear}/${toYear}`)
      .pipe(catchError(this.handleError));
  }

  // Rollback promotion (delete records for specific year)
  rollbackPromotion(year: number): Observable<{message: string, deletedCount: number, year: number}> {
    return this.http.delete<{message: string, deletedCount: number, year: number}>(`${this.promotionUrl}/rollback-promotion/${year}`)
      .pipe(catchError(this.handleError));
  }

  // LEGACY METHODS (for backward compatibility)
  
  bulkPromoteStudents(updates: any[]): Observable<any> {
    const request = { updates };
    return this.http.put(`${this.promotionUrl}/bulk-promote`, request)
      .pipe(catchError(this.handleError));
  }

  promoteStudent(id: string, newClass: string): Observable<StudentResponse> {
    return this.http.put<StudentResponse>(`${this.promotionUrl}/promote/${id}`, { currentClass: newClass })
      .pipe(catchError(this.handleError));
  }

  getStudentsByClass(className: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.promotionUrl}/by-class/${className}`)
      .pipe(catchError(this.handleError));
  }

  getPromotionStats(): Observable<any> {
    return this.http.get(`${this.promotionUrl}/stats`)
      .pipe(catchError(this.handleError));
  }

  updateStudentClass(id: string, currentClass: string): Observable<StudentResponse> {
    return this.http.put<StudentResponse>(`${this.apiUrl}/${id}`, { currentClass })
      .pipe(catchError(this.handleError));
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    
    console.error('StudentService Error:', errorMessage);
    return throwError(() => errorMessage);
  }
}