import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-student',
  imports: [CommonModule,  FormsModule],
  templateUrl: './add-student.component.html',
  styleUrl: './add-student.component.scss'
})
export class AddStudentComponent {

  selectedPhoto: File | null = null;
  onPhotoSelected(event: any): void {
    this.selectedPhoto = event.target.files[0];
    // You can preview or upload photo here
  }

  onSubmit(): void {
    // You can handle form submission logic here
    alert('Form submitted successfully!');
  }

}
