import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  email = '';

  constructor(private authService: AuthServiceService) {}

  onSubmit() {
    const payload = { email: this.email };

    this.authService.sendOtp(payload).subscribe({
      next: (res) => {
        alert('OTP sent successfully to your email!');
        // Optionally navigate to OTP verification page
        // this.router.navigate(['/auth/verify-otp']);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to send OTP. Please try again.');
      }
    });
  }
}
