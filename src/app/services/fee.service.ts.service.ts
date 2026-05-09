import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
 
// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------
export interface Fee {
  _id?: string;
  student?: string;
  studentName: string;
  rollNumber: string;
  className: string;
  totalFee: number;
  submittedFee: number;
  pendingDues?: number;   // virtual (from backend)
  status?: 'Complete' | 'Pending'; // virtual (from backend)
  feePeriod: string;
  notes?: string;
  addedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
 
export interface FeeFilters {
  className?: string;
  feePeriod?: string;
  status?: 'Complete' | 'Pending';
  search?: string;
}
 
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
 
export interface FeeSummary {
  totalRecords: number;
  totalFeeAssigned: number;
  totalSubmitted: number;
  totalPending: number;
}

@Injectable({
  providedIn: 'root'
})

export class FeeServiceTsService {
  private baseUrl = `${environment.apiUrl}/fees`;
 
  constructor(private http: HttpClient) {}

 getAllFees(filters?: FeeFilters): Observable<ApiResponse<{ fees: Fee[]; summary: any }>> {
    let params = new HttpParams();
    if (filters?.className) params = params.set('className', filters.className);
    if (filters?.feePeriod) params = params.set('feePeriod', filters.feePeriod);
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.search) params = params.set('search', filters.search);
 
    return this.http.get<ApiResponse<{ fees: Fee[]; summary: any }>>(this.baseUrl, { params });
  }
 
  /** Fetch a single fee record by ID */
  getFeeById(id: string): Observable<ApiResponse<Fee>> {
    return this.http.get<ApiResponse<Fee>>(`${this.baseUrl}/${id}`);
  }
 
  /** Create a new fee record */
  createFee(fee: Fee): Observable<ApiResponse<Fee>> {
    return this.http.post<ApiResponse<Fee>>(this.baseUrl, fee);
  }
 
  /** Update an existing fee record (partial update) */
  updateFee(id: string, fee: Partial<Fee>): Observable<ApiResponse<Fee>> {
    return this.http.put<ApiResponse<Fee>>(`${this.baseUrl}/${id}`, fee);
  }
 
  /** Delete a fee record */
  deleteFee(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
  }
 
  /** Fetch summary / dashboard stats */
  getFeeSummary(feePeriod?: string, className?: string): Observable<ApiResponse<FeeSummary>> {
    let params = new HttpParams();
    if (feePeriod) params = params.set('feePeriod', feePeriod);
    if (className) params = params.set('className', className);
    return this.http.get<ApiResponse<FeeSummary>>(`${this.baseUrl}/summary`, { params });
  }

}
