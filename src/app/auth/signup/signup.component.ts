import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  constructor(private authService: AuthServiceService) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    const { fullName, email, password, confirmPassword } = form.value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const userData = {
      fullName,
      email,
      password,
      confirmPassword
    };

    this.authService.register(userData).subscribe({
      next: (res) => {
        alert('Signup successful!');
        form.reset();
      },
      error: (err) => {
        console.error(err);
        alert('Signup failed');
      }
    });
  }
}
