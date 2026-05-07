import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


export interface StudentSuggestion {
  _id: string;
  name: string;
  rollNumber: string;
  admissionNumber?: string;
  className?: string;
}

export interface Fee {
  _id?: string;
  student?: string | StudentSuggestion;
  studentId?: string; 
  studentName: string;
  rollNumber: string;
  className: string;
  totalFee: number;
  submittedFee: number;
  pendingDues?: number;
  feePeriod: string;
  status?: 'Complete' | 'Pending';   
  notes?: string;
  addedBy?: string;
  createdAt?: string;
}

export interface FeeFilters {
  className?: string;
  feePeriod?: string;
  status?: string;
  search?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface FeesResponseData {
  fees: Fee[];
  summary: {
    totalRecords: number;
    totalFeeAmount: number;
    totalSubmitted: number;
    totalPending: number;
    completeCount: number;
    pendingCount: number;
  };
}



@Injectable({ providedIn: 'root' })
export class FeeService {
  private readonly base = `${environment.apiUrl}/fees`;

  constructor(private http: HttpClient) {}


  getAllFees(filters: FeeFilters = {}): Observable<ApiResponse<FeesResponseData>> {
    let params = new HttpParams();
    if (filters.className)  params = params.set('className',  filters.className);
    if (filters.feePeriod)  params = params.set('feePeriod',  filters.feePeriod);
    if (filters.status)     params = params.set('status',     filters.status);
    if (filters.search)     params = params.set('search',     filters.search);
    return this.http.get<ApiResponse<FeesResponseData>>(this.base, { params });
  }

  getFeeById(id: string): Observable<ApiResponse<Fee>> {
    return this.http.get<ApiResponse<Fee>>(`${this.base}/${id}`);
  }

  createFee(fee: Partial<Fee>): Observable<ApiResponse<Fee>> {
    return this.http.post<ApiResponse<Fee>>(this.base, fee);
  }

  updateFee(id: string, fee: Partial<Fee>): Observable<ApiResponse<Fee>> {
    return this.http.put<ApiResponse<Fee>>(`${this.base}/${id}`, fee);
  }

  deleteFee(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`);
  }

  searchStudents(query: string): Observable<ApiResponse<StudentSuggestion[]>> {
    const params = new HttpParams().set('q', query.trim());
    return this.http.get<ApiResponse<StudentSuggestion[]>>(
      `${this.base}/students/search`,
      { params }
    );
  }
}