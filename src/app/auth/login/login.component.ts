import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private router: Router,
    private authService: AuthServiceService,
    private toastr: ToastrService
  ) {}

onSubmit() {
  const credentials = {
    email: this.email,
    password: this.password
  };

  this.authService.login(credentials).subscribe({
    next: (res) => {
      localStorage.setItem('token', res.token);
      this.toastr.success('Login BrowserAnimationsModule!');
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      console.error(err);
      this.toastr.error('Invalid email or password!');
    }
  });
}

}
