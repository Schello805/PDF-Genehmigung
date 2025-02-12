import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    FooterComponent
  ],
  template: `
    <mat-toolbar color="primary">
      <span routerLink="/" style="cursor: pointer">Digitale Unterschriften</span>
      <span class="spacer"></span>
      <button mat-button routerLink="/upload">
        <mat-icon>upload_file</mat-icon>
        Hochladen
      </button>
      <button mat-button routerLink="/guide">
        <mat-icon>help</mat-icon>
        Anleitung
      </button>
      <button mat-button routerLink="/api-docs">
        <mat-icon>code</mat-icon>
        API Docs
      </button>
      <button mat-button routerLink="/settings">
        <mat-icon>settings</mat-icon>
        Einstellungen
      </button>
    </mat-toolbar>

    <main>
      <router-outlet></router-outlet>
    </main>

    <app-footer></app-footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .spacer {
      flex: 1 1 auto;
    }

    main {
      flex: 1;
      padding-bottom: 64px; /* Höhe des Footers */
    }

    mat-toolbar button {
      margin-left: 1rem;
    }

    mat-toolbar mat-icon {
      margin-right: 0.5rem;
    }
  `]
})
export class AppComponent {}
