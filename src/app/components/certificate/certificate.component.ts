import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-certificate',
  imports: [CommonModule, FormsModule],
  templateUrl: './certificate.component.html',
  styleUrl: './certificate.component.scss'
})
export class CertificateComponent {

  @ViewChild('certCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('certImg')    imgRef!: ElementRef<HTMLImageElement>;

  certificates = [
    { title: 'Birth Certificate',       image: 'assets/certificates/birthcertificate.jpeg' },
    { title: 'Character Certificate',   image: 'assets/certificates/Character.jpeg' },
    { title: 'Provisional Certificate', image: 'assets/certificates/Provisional certificate.jpeg' },
    { title: 'School Language',         image: 'assets/certificates/school-language.jpeg' }
  ];

  selectedCert: any = null;
  isEditing = false;
  tool = 'pen';
  penColor = '#ff0000';
  penSize = 3;

  private ctx!: CanvasRenderingContext2D;
  private painting = false;
  private history: ImageData[] = [];

  selectCert(cert: any) {
    this.selectedCert = { ...cert };
    this.isEditing = false;
  }

  goBack() {
    this.selectedCert = null;
    this.isEditing = false;
    this.history = [];
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  setTool(t: string) {
    this.tool = t;
  }

  initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const img    = this.imgRef.nativeElement;
    canvas.width  = img.offsetWidth;
    canvas.height = img.offsetHeight;
    this.ctx = canvas.getContext('2d')!;
  }

  startDraw(e: MouseEvent) {
    if (!this.isEditing) return;
    this.painting = true;
    this.history.push(this.ctx.getImageData(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height));

    if (this.tool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        const rect = this.canvasRef.nativeElement.getBoundingClientRect();
        this.ctx.font = `${this.penSize * 6}px Arial`;
        this.ctx.fillStyle = this.penColor;
        this.ctx.fillText(text, e.clientX - rect.left, e.clientY - rect.top);
      }
      this.painting = false;
      return;
    }

    this.ctx.beginPath();
    this.ctx.moveTo(...this.getPos(e));
  }

  draw(e: MouseEvent) {
    if (!this.painting || this.tool === 'text') return;
    if (this.tool === 'erase') {
      this.ctx.clearRect(...this.getPos(e), this.penSize * 4, this.penSize * 4);
      return;
    }
    this.ctx.lineWidth   = this.penSize;
    this.ctx.lineCap     = 'round';
    this.ctx.strokeStyle = this.penColor;
    this.ctx.lineTo(...this.getPos(e));
    this.ctx.stroke();
  }

  stopDraw() { this.painting = false; }

  undo() {
    if (this.history.length === 0) return;
    this.ctx.putImageData(this.history.pop()!, 0, 0);
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    this.history = [];
  }

  private getPos(e: MouseEvent): [number, number] {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  }

  printCert() {
    window.print();
  }
}