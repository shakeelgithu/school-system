import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  }

  onSubmit(): void {
    alert('Form submitted successfully!');
  }

}
