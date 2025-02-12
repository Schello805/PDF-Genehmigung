import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class SignaturePadComponent {
  @ViewChild('signaturePad') signaturePadElement!: ElementRef;
  @Output() signatureCreated = new EventEmitter<string>();

  private signaturePad!: SignaturePad;

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
  }

  clear() {
    this.signaturePad.clear();
  }

  save() {
    if (!this.signaturePad.isEmpty()) {
      const signature = this.signaturePad.toDataURL();
      this.signatureCreated.emit(signature);
    }
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = this.signaturePadElement.nativeElement;
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Calculate dimensions to maintain aspect ratio
          let width = img.width;
          let height = img.height;
          if (width > canvas.width) {
            height = (canvas.width / width) * height;
            width = canvas.width;
          }
          if (height > canvas.height) {
            width = (canvas.height / height) * width;
            height = canvas.height;
          }
          
          // Center the image
          const x = (canvas.width - width) / 2;
          const y = (canvas.height - height) / 2;
          
          ctx.drawImage(img, x, y, width, height);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
