import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SignatureFieldsUpdateData {
  signatureFields: any[];
  updaterName?: string;
  updaterEmail?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private cleanAccessToken(token: string): string {
    if (!token) return token;
    
    console.log('Original token:', token);
    // Entferne alle Vorkommen von 'documents/' aus dem Token
    let cleanedToken = token;
    while (cleanedToken.includes('documents/')) {
      cleanedToken = cleanedToken.replace('documents/', '');
    }
    console.log('Cleaned token:', cleanedToken);
    return cleanedToken;
  }

  uploadDocument(file: File, creatorName: string, creatorEmail: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('creatorName', creatorName);
    formData.append('creatorEmail', creatorEmail);
    return this.http.post(`${this.apiUrl}/api/documents/upload`, formData);
  }

  getDocument(accessToken: string): Observable<any> {
    const cleanToken = this.cleanAccessToken(accessToken);
    return this.http.get(`${this.apiUrl}/api/documents/${cleanToken}`);
  }

  getDocumentFile(accessToken: string): Observable<Blob> {
    const cleanToken = this.cleanAccessToken(accessToken);
    return this.http.get(`${this.apiUrl}/api/documents/${cleanToken}/file`, { responseType: 'blob' });
  }

  updateSignatureFields(accessToken: string, data: SignatureFieldsUpdateData): Observable<any> {
    const cleanToken = this.cleanAccessToken(accessToken);
    return this.http.put(`${this.apiUrl}/api/documents/${cleanToken}/fields`, {
      signatureFields: data.signatureFields,
      updaterName: data.updaterName || 'Document Creator',
      updaterEmail: data.updaterEmail || 'no-email@example.com'
    });
  }

  sign(accessToken: string, data: any): Observable<any> {
    const cleanToken = this.cleanAccessToken(accessToken);
    return this.http.post(`${this.apiUrl}/api/documents/${cleanToken}/sign`, data);
  }

  downloadFinal(accessToken: string): Observable<Blob> {
    const cleanToken = this.cleanAccessToken(accessToken);
    return this.http.get(`${this.apiUrl}/api/documents/${cleanToken}/download`, {
      responseType: 'blob'
    });
  }

  getFile(accessToken: string): Observable<Blob> {
    const cleanToken = this.cleanAccessToken(accessToken);
    return this.http.get(`${this.apiUrl}/api/documents/${cleanToken}/file`, {
      responseType: 'blob'
    });
  }
}
