import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post('http://localhost:5000/api/auth/register', userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post('http://localhost:5000/api/auth/login', credentials);
  }

  sendOtp(data: any): Observable<any> {
  return this.http.post('http://localhost:5000/api/auth/forgot-password', data);
}
}
