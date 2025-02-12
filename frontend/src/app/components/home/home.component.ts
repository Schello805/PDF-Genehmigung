import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  template: `
    <div class="home-container">
      <header class="hero" @fadeInUp>
        <h1>Digitale Unterschriften leicht gemacht</h1>
        <p class="subtitle">Sicher, schnell und rechtsgültig Dokumente unterschreiben</p>
      </header>

      <div class="features">
        <mat-card class="feature-card" @fadeInUp>
          <mat-card-header>
            <mat-icon>upload_file</mat-icon>
            <mat-card-title>Dokumente hochladen</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Laden Sie PDF-Dokumente hoch und bereiten Sie sie für Unterschriften vor.</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="feature-card" @fadeInUp>
          <mat-card-header>
            <mat-icon>edit</mat-icon>
            <mat-card-title>Unterschriftenfelder platzieren</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Fügen Sie Unterschriftenfelder hinzu und positionieren Sie sie nach Bedarf.</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="feature-card" @fadeInUp>
          <mat-card-header>
            <mat-icon>share</mat-icon>
            <mat-card-title>Teilen & Zusammenarbeiten</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Teilen Sie Dokumente mit anderen und sammeln Sie Unterschriften.</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="feature-card" @fadeInUp>
          <mat-card-header>
            <mat-icon>verified</mat-icon>
            <mat-card-title>Sicher unterschreiben</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Unterschreiben Sie digital mit verschiedenen Methoden.</p>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="cta-section" @fadeInUp>
        <button mat-raised-button color="primary" routerLink="/upload">
          Jetzt Dokument hochladen
        </button>
        <button mat-button routerLink="/guide">
          Zur Anleitung
        </button>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .hero {
      text-align: center;
      margin: 4rem 0;
    }

    .hero h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .subtitle {
      font-size: 1.2rem;
      color: rgba(0, 0, 0, 0.6);
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin: 4rem 0;
    }

    .feature-card {
      height: 100%;
    }

    .feature-card mat-card-header {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
    }

    .feature-card mat-icon {
      font-size: 2rem;
      height: 2rem;
      width: 2rem;
      margin-right: 1rem;
      color: #3f51b5;
    }

    .cta-section {
      text-align: center;
      margin: 4rem 0;
    }

    .cta-section button {
      margin: 0 1rem;
    }
  `]
})
export class HomeComponent {}
