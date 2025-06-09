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
  profileImage?: string; // ✅ Add this property
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

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/students`; // Using environment

  constructor(private http: HttpClient) {}

  // Get all students
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // Get student by ID
  getStudentById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Create student with file upload
  createStudent(studentData: Student, file?: File): Observable<StudentResponse> {
    const formData = new FormData();
    
    // Append all student data
    Object.keys(studentData).forEach(key => {
      if (key !== 'photo' && key !== 'profileImage' && studentData[key as keyof Student]) {
        formData.append(key, studentData[key as keyof Student] as string);
      }
    });
    
    // Append file if provided
    if (file) {
      formData.append('photo', file);
    }

    return this.http.post<StudentResponse>(this.apiUrl, formData)
      .pipe(catchError(this.handleError));
  }

  // Update student with file upload
  updateStudent(id: string, studentData: Student, file?: File): Observable<StudentResponse> {
    const formData = new FormData();
    
    // Append all student data
    Object.keys(studentData).forEach(key => {
      if (key !== 'photo' && key !== 'profileImage' && studentData[key as keyof Student]) {
        formData.append(key, studentData[key as keyof Student] as string);
      }
    });
    
    // Append file if provided
    if (file) {
      formData.append('photo', file);
    }

    return this.http.put<StudentResponse>(`${this.apiUrl}/${id}`, formData)
      .pipe(catchError(this.handleError));
  }

  // Delete student
  deleteStudent(id: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Helper method to get image URL
  getImageUrl(filename: string): string {
    if (!filename) return 'assets/images/default-avatar.jpg';
    return `${environment.apiUrl.replace('/api', '')}/uploads/${filename}`;
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}