import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { SignaturePadComponent } from '../signature-pad/signature-pad.component';

@Component({
  selector: 'app-signature-dialog',
  templateUrl: './signature-dialog.component.html',
  styleUrls: ['./signature-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatIconModule,
    SignaturePadComponent
  ]
})
export class SignatureDialogComponent {
  signatureForm: FormGroup;
  signatureMode: 'draw' | 'type' | 'upload' = 'draw';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SignatureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.signatureForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      comment: [''],
      signature: ['', Validators.required]
    });
  }

  onSignatureCreated(signature: string | File) {
    if (signature instanceof File) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.signatureForm.patchValue({ signature: e.target.result });
        }
      };
      reader.readAsDataURL(signature);
    } else {
      this.signatureForm.patchValue({ signature });
    }
  }

  onSubmit() {
    if (this.signatureForm.valid) {
      this.dialogRef.close(this.signatureForm.value);
    }
  }

  setSignatureMode(mode: 'draw' | 'type' | 'upload') {
    this.signatureMode = mode;
    this.signatureForm.patchValue({ signature: '' });
  }

  generateTypeSignature() {
    const name = this.signatureForm.get('name')?.value;
    if (name) {
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#000';
        ctx.font = 'italic 50px "Dancing Script", cursive';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(name, canvas.width / 2, canvas.height / 2);
        this.signatureForm.patchValue({ signature: canvas.toDataURL() });
      }
    }
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.onSignatureCreated(input.files[0]);
    }
  }
}
