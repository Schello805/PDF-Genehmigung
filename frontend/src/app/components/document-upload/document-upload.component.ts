import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DocumentService } from '../../services/document.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ]
})
export class DocumentUploadComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  isUploading = false;

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.uploadForm = this.fb.group({
      creatorName: ['', Validators.required],
      creatorEmail: ['', [Validators.required, Validators.email]],
      file: [null, Validators.required]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      this.uploadForm.patchValue({ file });
    } else {
      this.snackBar.open('Please select a valid PDF file', 'Close', { duration: 3000 });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.uploadForm.valid && this.selectedFile) {
      this.isUploading = true;
      const creatorName = this.uploadForm.get('creatorName')?.value || '';
      const creatorEmail = this.uploadForm.get('creatorEmail')?.value || '';
      
      try {
        const response = await this.documentService.uploadDocument(
          this.selectedFile,
          creatorName,
          creatorEmail
        ).toPromise();

        this.snackBar.open('Document uploaded successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/document', response.accessToken]);
      } catch (error) {
        this.snackBar.open('Error uploading document', 'Close', { duration: 3000 });
      } finally {
        this.isUploading = false;
      }
    }
  }
}
