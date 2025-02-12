import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <div class="settings-container">
      <h1>Einstellungen</h1>
      
      <div class="settings-section">
        <h2>API-Einstellungen</h2>
        <mat-form-field appearance="fill">
          <mat-label>API URL</mat-label>
          <input matInput [(ngModel)]="settings.apiUrl" placeholder="http://localhost:3000">
        </mat-form-field>

        <div class="test-connection">
          <button mat-raised-button color="primary" (click)="testConnection()">
            Verbindung testen
          </button>
        </div>
      </div>

      <div class="settings-section">
        <h2>E-Mail-Einstellungen</h2>
        <mat-form-field appearance="fill">
          <mat-label>SMTP Server</mat-label>
          <input matInput [(ngModel)]="settings.smtpServer">
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>SMTP Port</mat-label>
          <input matInput type="number" [(ngModel)]="settings.smtpPort">
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>E-Mail Absender</mat-label>
          <input matInput [(ngModel)]="settings.emailSender">
        </mat-form-field>
      </div>

      <div class="actions">
        <button mat-raised-button color="primary" (click)="saveSettings()">
          Einstellungen speichern
        </button>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
    }

    .settings-section {
      margin-bottom: 2rem;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 1rem;
    }

    .test-connection {
      margin: 1rem 0;
    }

    .actions {
      margin-top: 2rem;
      text-align: right;
    }
  `]
})
export class SettingsComponent {
  settings = {
    apiUrl: environment.apiUrl,
    smtpServer: '',
    smtpPort: 587,
    emailSender: ''
  };

  constructor(private snackBar: MatSnackBar) {}

  async testConnection() {
    try {
      const response = await fetch(this.settings.apiUrl + '/api/health');
      if (response.ok) {
        this.snackBar.open('Verbindung erfolgreich!', 'Schließen', { duration: 3000 });
      } else {
        throw new Error('API nicht erreichbar');
      }
    } catch (error: any) {
      this.snackBar.open('Verbindungsfehler: ' + (error.message || 'Unbekannter Fehler'), 'Schließen', { duration: 5000 });
    }
  }

  saveSettings() {
    // Speichere die Einstellungen im localStorage
    localStorage.setItem('appSettings', JSON.stringify(this.settings));
    this.snackBar.open('Einstellungen gespeichert!', 'Schließen', { duration: 3000 });
  }
}
