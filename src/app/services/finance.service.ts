import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Teacher {
  _id?: string;
  name: string;
  subject: string;
  phone: string;
  email: string;
  monthlySalary: number;
  joiningDate: string;
  status: 'Active' | 'Inactive';
}

export interface SalaryPayment {
  _id?: string;
  teacher: any;
  month: string;
  year: number;
  amount: number;
  advance: number;
  deduction: number;
  netPaid: number;
  paidOn: string;
  note: string;
  status: 'Paid' | 'Advance' | 'Pending';
}

export interface Expense {
  _id?: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  paidTo: string;
}

export interface FeeCollection {
  _id?: string;
  student: any;
  month: string;
  year: number;
  amount: number;
  paidOn: string;
  receivedBy: string;
  note: string;
  status: 'Paid' | 'Partial' | 'Pending';
}

@Injectable({ providedIn: 'root' })
export class FinanceService {
 private base = `${environment.apiUrl}/finance`;

  constructor(private http: HttpClient) {}

  // Teachers
  getTeachers(): Observable<Teacher[]> { return this.http.get<Teacher[]>(`${this.base}/teachers`); }
  createTeacher(t: Teacher): Observable<Teacher> { return this.http.post<Teacher>(`${this.base}/teachers`, t); }
  updateTeacher(id: string, t: Teacher): Observable<Teacher> { return this.http.put<Teacher>(`${this.base}/teachers/${id}`, t); }
  deleteTeacher(id: string): Observable<any> { return this.http.delete(`${this.base}/teachers/${id}`); }

  // Salaries
  getSalaries(): Observable<SalaryPayment[]> { return this.http.get<SalaryPayment[]>(`${this.base}/salaries`); }
  createSalary(s: SalaryPayment): Observable<SalaryPayment> { return this.http.post<SalaryPayment>(`${this.base}/salaries`, s); }
  deleteSalary(id: string): Observable<any> { return this.http.delete(`${this.base}/salaries/${id}`); }

  // Expenses
  getExpenses(): Observable<Expense[]> { return this.http.get<Expense[]>(`${this.base}/expenses`); }
  createExpense(e: Expense): Observable<Expense> { return this.http.post<Expense>(`${this.base}/expenses`, e); }
  updateExpense(id: string, e: Expense): Observable<Expense> { return this.http.put<Expense>(`${this.base}/expenses/${id}`, e); }
  deleteExpense(id: string): Observable<any> { return this.http.delete(`${this.base}/expenses/${id}`); }

  // Fees
  getFees(): Observable<FeeCollection[]> { return this.http.get<FeeCollection[]>(`${this.base}/fees`); }
  createFee(f: FeeCollection): Observable<FeeCollection> { return this.http.post<FeeCollection>(`${this.base}/fees`, f); }
  deleteFee(id: string): Observable<any> { return this.http.delete(`${this.base}/fees/${id}`); }

  // Summary
  getSummary(month: string, year: number): Observable<any> {
    return this.http.get(`${this.base}/summary?month=${month}&year=${year}`);
  }
}