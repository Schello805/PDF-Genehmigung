import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-api-docs',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule
  ],
  template: `
    <div class="api-docs-container">
      <h1>API Dokumentation</h1>
      
      <mat-card>
        <mat-card-content>
          <p>
            Die API-Dokumentation ist über Swagger UI verfügbar unter:
            <a [href]="swaggerUrl" target="_blank" class="swagger-link">
              {{ swaggerUrl }}
            </a>
          </p>
          
          <button mat-raised-button color="primary" (click)="openSwaggerUi()">
            Swagger UI öffnen
          </button>
        </mat-card-content>
      </mat-card>

      <mat-card class="endpoints-card">
        <mat-card-header>
          <mat-card-title>Wichtige Endpunkte</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-tab-group>
            <mat-tab label="Dokumente">
              <div class="endpoint-list">
                <div class="endpoint">
                  <h3>Dokument hochladen</h3>
                  <p><strong>POST</strong> /api/documents/upload</p>
                  <p>Lädt ein neues PDF-Dokument hoch.</p>
                </div>
                
                <div class="endpoint">
                  <h3>Dokument abrufen</h3>
                  <p><strong>GET</strong> /api/documents/{accessToken}</p>
                  <p>Ruft die Metadaten eines Dokuments ab.</p>
                </div>
              </div>
            </mat-tab>
            
            <mat-tab label="Unterschriften">
              <div class="endpoint-list">
                <div class="endpoint">
                  <h3>Unterschriftenfelder aktualisieren</h3>
                  <p><strong>PUT</strong> /api/documents/{accessToken}/fields</p>
                  <p>Aktualisiert die Position und Größe der Unterschriftenfelder.</p>
                </div>
                
                <div class="endpoint">
                  <h3>Dokument unterschreiben</h3>
                  <p><strong>POST</strong> /api/documents/{accessToken}/sign</p>
                  <p>Fügt eine Unterschrift zu einem Unterschriftenfeld hinzu.</p>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .api-docs-container {
      max-width: 1000px;
      margin: 2rem auto;
      padding: 1rem;
    }

    h1 {
      margin-bottom: 2rem;
    }

    .swagger-link {
      display: block;
      margin: 1rem 0;
      color: #3f51b5;
      text-decoration: none;
    }

    .swagger-link:hover {
      text-decoration: underline;
    }

    .endpoints-card {
      margin-top: 2rem;
    }

    .endpoint-list {
      padding: 1rem;
    }

    .endpoint {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }

    .endpoint:last-child {
      border-bottom: none;
    }

    .endpoint h3 {
      color: #3f51b5;
      margin-bottom: 0.5rem;
    }

    .endpoint p {
      margin: 0.5rem 0;
    }

    .endpoint p strong {
      color: #4caf50;
      font-family: monospace;
      padding: 0.2rem 0.4rem;
      background: #f5f5f5;
      border-radius: 4px;
    }
  `]
})
export class ApiDocsComponent implements OnInit {
  swaggerUrl = environment.apiUrl + '/api-docs';

  ngOnInit() {
    // Prüfe, ob die Swagger UI erreichbar ist
    fetch(this.swaggerUrl)
      .catch(error => {
        console.error('Swagger UI nicht erreichbar:', error);
      });
  }

  openSwaggerUi() {
    window.open(this.swaggerUrl, '_blank');
  }
}
