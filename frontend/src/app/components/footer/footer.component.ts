import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatToolbarModule],
  template: `
    <mat-toolbar class="footer">
      <div class="footer-content">
        <p>
          Ein Open Source Projekt von 
          <a href="mailto:info@schellenberger.biz">Michael Schellenberger</a>
        </p>
        <p class="version">Version 1.0.0</p>
        <p>
          <a href="https://github.com/yourusername/project" target="_blank">
            GitHub Repository
          </a>
        </p>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      background-color: #f5f5f5;
      color: rgba(0, 0, 0, 0.87);
      font-size: 0.9rem;
      height: 64px;
    }

    .footer-content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
    }

    a {
      color: inherit;
      text-decoration: none;
      border-bottom: 1px dotted;
    }

    a:hover {
      border-bottom: 1px solid;
    }

    .version {
      opacity: 0.7;
    }
  `]
})
export class FooterComponent {}
