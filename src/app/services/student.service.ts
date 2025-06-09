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

  getStudentById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Create new student
  createStudent(student: Student): Observable<StudentResponse> {
    return this.http.post<StudentResponse>(this.apiUrl, student)
      .pipe(catchError(this.handleError));
  }

  // Update student
  updateStudent(id: string, student: Student): Observable<StudentResponse> {
    return this.http.put<StudentResponse>(`${this.apiUrl}/${id}`, student)
      .pipe(catchError(this.handleError));
  }

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