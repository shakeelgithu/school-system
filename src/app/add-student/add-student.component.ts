import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-student',
  imports: [CommonModule,  FormsModule],
  templateUrl: './add-student.component.html',
  styleUrl: './add-student.component.scss'
})
export class AddStudentComponent {

   @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  selectedPhoto: File | null = null;
  photoPreview: string | null = null;
  showCamera: boolean = false;

   private stream: MediaStream | null = null;

  async openCamera(): Promise<void> {
    try {
      // Request camera access — NO gallery, direct camera stream
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',   // 'user' = front cam, 'environment' = rear cam
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });

      this.showCamera = true;

      // Wait for Angular to render the video element, then attach stream
      setTimeout(() => {
        if (this.videoElement?.nativeElement) {
          this.videoElement.nativeElement.srcObject = this.stream;
        }
      }, 100);

    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        alert('Camera permission denied. Please allow camera access and try again.');
      } else if (err.name === 'NotFoundError') {
        alert('No camera found on this device.');
      } else {
        alert('Could not open camera: ' + err.message);
      }
    }
  }

  capturePhoto(): void {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas snapshot to preview URL
    this.photoPreview = canvas.toDataURL('image/jpeg', 0.9);

    // Convert to File object for form submission
    canvas.toBlob((blob) => {
      if (blob) {
        this.selectedPhoto = new File([blob], 'student-photo.jpg', { type: 'image/jpeg' });
      }
    }, 'image/jpeg', 0.9);

    this.closeCamera();
  }

  closeCamera(): void {
    this.stopStream();
    this.showCamera = false;
  }

  removePhoto(): void {
    this.selectedPhoto = null;
    this.photoPreview = null;
  }

  private stopStream(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  // Always stop camera when component is destroyed
  ngOnDestroy(): void {
    this.stopStream();
  }

  onSubmit(): void {
    if (!this.selectedPhoto) {
      alert('Please take a photo before submitting.');
      return;
    }
    alert('Form submitted successfully!');
  }

}
