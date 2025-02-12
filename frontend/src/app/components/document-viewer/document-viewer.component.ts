import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SignatureDialogComponent } from '../signature-dialog/signature-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatListModule,
    PdfViewerModule,
    MatDialogModule,
    MatSnackBarModule
  ]
})
export class DocumentViewerComponent implements OnInit, OnDestroy {
  document: any;
  pdfSrc: string = '';
  isCreator = false;
  accessToken: string;
  signatureFields: any[] = [];
  isPlacingSignature = false;
  selectedField: any = null;
  isDragging = false;
  isResizing = false;
  dragStartX = 0;
  dragStartY = 0;
  fieldStartX = 0;
  fieldStartY = 0;
  resizeHandle = '';
  pageHeights: number[] = [];
  pdfViewerContainer: HTMLElement | null = null;

  constructor(
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.accessToken = this.route.snapshot.params['accessToken'];
  }

  ngOnInit() {
    this.loadDocument();
    this.setupDragListeners();
  }

  ngOnDestroy() {
    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    window.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }

  setupPdfViewerListener() {
    // Warte auf das PDF-Viewer-Element
    const checkPdfViewer = setInterval(() => {
      const pdfViewer = document.querySelector('pdf-viewer');
      if (pdfViewer) {
        clearInterval(checkPdfViewer);
        this.pdfViewerContainer = pdfViewer as HTMLElement;
        // Beobachte Größenänderungen der PDF-Seiten
        const observer = new MutationObserver(() => {
          this.updatePageHeights();
        });
        observer.observe(pdfViewer, { childList: true, subtree: true });
      }
    }, 100);
  }

  updatePageHeights() {
    if (!this.pdfViewerContainer) return;
    
    const pages = this.pdfViewerContainer.querySelectorAll('.page');
    this.pageHeights = Array.from(pages).map(page => {
      const rect = page.getBoundingClientRect();
      return rect.height;
    });
  }

  getPageOffset(pageNum: number): number {
    if (!pageNum || pageNum <= 1) return 0;
    return this.pageHeights.slice(0, pageNum - 1).reduce((sum, height) => sum + height, 0);
  }

  setupDragListeners() {
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  loadDocument() {
    this.documentService.getDocument(this.accessToken)
      .subscribe({
        next: (doc) => {
          this.document = doc;
          this.signatureFields = doc.signatureFields || [];
          this.isCreator = doc.createdBy?.email === 'your.email@example.com'; // TODO: Replace with actual user email
        },
        error: (error) => {
          console.error('Error loading document:', error);
        }
      });

    this.documentService.getDocumentFile(this.accessToken)
      .subscribe({
        next: (blob) => {
          this.pdfSrc = URL.createObjectURL(blob);
          setTimeout(() => {
            this.setupPdfViewerListener();
          }, 1000);
        },
        error: (error) => {
          console.error('Error loading PDF file:', error);
        }
      });
  }

  selectField(field: any) {
    if (this.isPlacingSignature) return;
    this.selectedField = field;
  }

  onFieldMouseDown(event: MouseEvent, field: any) {
    if (this.isPlacingSignature || field.signedBy) return;
    
    this.isDragging = true;
    this.selectedField = field;
    
    const pdfViewer = document.querySelector('pdf-viewer');
    if (!pdfViewer) return;

    const pages = pdfViewer.querySelectorAll('.page');
    const page = pages[field.page - 1];
    if (!page) return;

    const rect = page.getBoundingClientRect();
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.fieldStartX = field.x;
    this.fieldStartY = field.y;
    
    event.stopPropagation();
  }

  onResizeStart(event: MouseEvent, field: any, handle: string) {
    if (this.isPlacingSignature || field.signedBy) return;
    
    this.isResizing = true;
    this.selectedField = field;
    this.resizeHandle = handle;
    
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.fieldStartX = field.width;
    this.fieldStartY = field.height;
    
    event.stopPropagation();
  }

  onMouseMove(event: MouseEvent) {
    if (!this.selectedField) return;

    const pdfViewer = document.querySelector('pdf-viewer');
    if (!pdfViewer) return;

    const pages = pdfViewer.querySelectorAll('.page');
    const page = pages[this.selectedField.page - 1];
    if (!page) return;

    const rect = page.getBoundingClientRect();
    
    if (this.isDragging) {
      const deltaX = ((event.clientX - this.dragStartX) / rect.width) * 100;
      const deltaY = ((event.clientY - this.dragStartY) / rect.height) * 100;
      
      this.selectedField.x = Math.max(0, Math.min(100 - this.selectedField.width, this.fieldStartX + deltaX));
      this.selectedField.y = Math.max(0, Math.min(100 - this.selectedField.height, this.fieldStartY + deltaY));
    } else if (this.isResizing) {
      const deltaX = ((event.clientX - this.dragStartX) / rect.width) * 100;
      const deltaY = ((event.clientY - this.dragStartY) / rect.height) * 100;
      
      switch (this.resizeHandle) {
        case 'bottom-right':
          this.selectedField.width = Math.max(10, Math.min(100 - this.selectedField.x, this.fieldStartX + deltaX));
          this.selectedField.height = Math.max(10, Math.min(100 - this.selectedField.y, this.fieldStartY + deltaY));
          break;
        case 'bottom-left':
          const newWidth = this.fieldStartX - deltaX;
          if (newWidth >= 10 && this.selectedField.x + deltaX >= 0) {
            this.selectedField.width = newWidth;
            this.selectedField.x = this.fieldStartX + deltaX;
          }
          this.selectedField.height = Math.max(10, Math.min(100 - this.selectedField.y, this.fieldStartY + deltaY));
          break;
        case 'top-right':
          this.selectedField.width = Math.max(10, Math.min(100 - this.selectedField.x, this.fieldStartX + deltaX));
          const newHeight = this.fieldStartY - deltaY;
          if (newHeight >= 10 && this.selectedField.y + deltaY >= 0) {
            this.selectedField.height = newHeight;
            this.selectedField.y = this.fieldStartY + deltaY;
          }
          break;
        case 'top-left':
          const newWidthTL = this.fieldStartX - deltaX;
          const newHeightTL = this.fieldStartY - deltaY;
          if (newWidthTL >= 10 && this.selectedField.x + deltaX >= 0) {
            this.selectedField.width = newWidthTL;
            this.selectedField.x = this.fieldStartX + deltaX;
          }
          if (newHeightTL >= 10 && this.selectedField.y + deltaY >= 0) {
            this.selectedField.height = newHeightTL;
            this.selectedField.y = this.fieldStartY + deltaY;
          }
          break;
      }
    }
  }

  onMouseUp() {
    if (this.isDragging || this.isResizing) {
      this.isDragging = false;
      this.isResizing = false;
      this.updateSignatureFields(); // Update nur nach dem Beenden des Drag/Resize
    }
  }

  deleteField(field: any) {
    const index = this.signatureFields.indexOf(field);
    if (index > -1) {
      this.signatureFields.splice(index, 1);
      this.selectedField = null;
      this.updateSignatureFields();
    }
  }

  async openSignatureDialog(field: any) {
    if (field.signedBy || this.isDragging || this.isResizing) return;

    const dialogRef = this.dialog.open(SignatureDialogComponent, {
      width: '600px',
      data: { field }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        field.signedBy = result;
        await this.updateSignatureFields();
      }
    });
  }

  toggleSignaturePlacement() {
    this.isPlacingSignature = !this.isPlacingSignature;
    if (this.isPlacingSignature) {
      this.selectedField = null; // Deselektiere das aktuelle Feld
    } else {
      this.updateSignatureFields(); // Update erst beim Beenden des Platzierungsmodus
    }
  }

  onPdfClick(event: any) {
    if (!this.isPlacingSignature) return;

    const pdfViewer = document.querySelector('pdf-viewer');
    if (!pdfViewer) return;

    const rect = pdfViewer.getBoundingClientRect();
    const pages = pdfViewer.querySelectorAll('.page');
    let currentPageOffset = 0;
    let targetPage = 1;

    // Finde die aktuelle Seite basierend auf der Y-Position
    for (let i = 0; i < pages.length; i++) {
      const pageRect = pages[i].getBoundingClientRect();
      if (event.clientY >= pageRect.top && event.clientY <= pageRect.bottom) {
        targetPage = i + 1;
        break;
      }
      currentPageOffset += pageRect.height;
    }

    const pageRect = pages[targetPage - 1].getBoundingClientRect();
    const x = ((event.clientX - pageRect.left) / pageRect.width) * 100;
    const y = ((event.clientY - pageRect.top) / pageRect.height) * 100;

    this.signatureFields.push({
      x,
      y,
      width: 20,
      height: 10,
      page: targetPage,
      order: this.signatureFields.length + 1
    });

    // Kein sofortiges Update mehr hier
  }

  updateSignatureFields() {
    if (this.isPlacingSignature) return; // Keine Updates während des Platzierens
    
    this.documentService.updateSignatureFields(this.accessToken, {
      signatureFields: this.signatureFields,
      updaterName: this.document.createdBy.name,
      updaterEmail: this.document.createdBy.email
    }).subscribe({
      next: () => {
        // Optional: Erfolgsbenachrichtigung
      },
      error: (error) => {
        console.error('Error updating signature fields:', error);
        this.snackBar.open('Error updating signature fields', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    });
  }

  downloadFinal() {
    this.documentService.downloadFinal(this.accessToken)
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.document.originalName}_signed.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
  }
}
