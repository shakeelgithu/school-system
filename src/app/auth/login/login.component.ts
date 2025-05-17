import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private router: Router) {}

  onSubmit() {
    // Dummy authentication logic
    if (this.email === 'admin@school.com' && this.password === 'admin123') {
      // Store token or user info if needed
      this.router.navigate(['/dashboard']);
    } else {
      alert('Invalid email or password!');
    }
  }
}
