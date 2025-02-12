import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-guide',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule
  ],
  template: `
    <div class="guide-container">
      <h1>Anleitung zur digitalen Unterschriften-App</h1>

      <mat-accordion>
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>
              1. Dokument hochladen
            </mat-panel-title>
          </mat-expansion-panel-header>
          <div class="guide-content">
            <p>Um ein Dokument zur Unterschrift vorzubereiten:</p>
            <ol>
              <li>Klicken Sie auf "Dokument hochladen"</li>
              <li>Wählen Sie eine PDF-Datei aus</li>
              <li>Geben Sie Ihren Namen und E-Mail-Adresse ein</li>
              <li>Klicken Sie auf "Hochladen"</li>
            </ol>
          </div>
        </mat-expansion-panel>

        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>
              2. Unterschriftenfelder platzieren
            </mat-panel-title>
          </mat-expansion-panel-header>
          <div class="guide-content">
            <p>Nach dem Hochladen können Sie Unterschriftenfelder hinzufügen:</p>
            <ol>
              <li>Klicken Sie auf "Unterschrift hinzufügen"</li>
              <li>Klicken Sie auf die gewünschte Position im Dokument</li>
              <li>Passen Sie die Größe des Unterschriftenfeldes an</li>
              <li>Wiederholen Sie den Vorgang für weitere Unterschriften</li>
            </ol>
          </div>
        </mat-expansion-panel>

        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>
              3. Dokument teilen
            </mat-panel-title>
          </mat-expansion-panel-header>
          <div class="guide-content">
            <p>Teilen Sie das Dokument mit den Unterzeichnern:</p>
            <ol>
              <li>Kopieren Sie den generierten Link</li>
              <li>Senden Sie den Link an die Unterzeichner</li>
              <li>Die Unterzeichner können das Dokument öffnen und unterschreiben</li>
            </ol>
          </div>
        </mat-expansion-panel>

        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>
              4. Unterschreiben
            </mat-panel-title>
          </mat-expansion-panel-header>
          <div class="guide-content">
            <p>So unterschreiben Sie ein Dokument:</p>
            <ol>
              <li>Öffnen Sie den erhaltenen Link</li>
              <li>Prüfen Sie das Dokument</li>
              <li>Klicken Sie auf ein Unterschriftenfeld</li>
              <li>Zeichnen Sie Ihre Unterschrift oder laden Sie ein Bild hoch</li>
              <li>Bestätigen Sie die Unterschrift</li>
            </ol>
          </div>
        </mat-expansion-panel>
      </mat-accordion>
    </div>
  `,
  styles: [`
    .guide-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 1rem;
    }

    h1 {
      margin-bottom: 2rem;
      text-align: center;
    }

    .guide-content {
      padding: 1rem;
    }

    mat-expansion-panel {
      margin-bottom: 1rem;
    }

    ol {
      margin-left: 1.5rem;
    }

    li {
      margin-bottom: 0.5rem;
    }
  `]
})
export class GuideComponent {}
