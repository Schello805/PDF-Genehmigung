# Digital Signature API

Diese API ermöglicht das Hochladen, Verwalten und digitale Signieren von PDF-Dokumenten.

## Features

- Upload von PDF-Dokumenten
- Platzierung von Signaturfeldern auf PDF-Seiten
- Digitale Signatur von Dokumenten
- Audit-Trail für alle Aktionen
- E-Mail-Benachrichtigungen
- Download von signierten Dokumenten

## API-Dokumentation

Die vollständige API-Dokumentation ist über Swagger UI verfügbar unter:
```
http://localhost:3000/api-docs
```

## Endpunkte

### Dokumente

- `POST /api/documents/upload` - Neues Dokument hochladen
- `GET /api/documents/{accessToken}` - Dokumentinformationen abrufen
- `GET /api/documents/{accessToken}/file` - PDF-Datei herunterladen
- `PUT /api/documents/{accessToken}/fields` - Signaturfelder aktualisieren
- `POST /api/documents/{accessToken}/sign` - Dokument signieren
- `GET /api/documents/{accessToken}/download` - Signiertes Dokument herunterladen

## Installation

1. Repository klonen
2. Dependencies installieren:
   ```bash
   npm install
   ```
3. `.env` Datei erstellen basierend auf `.env.example`
4. Server starten:
   ```bash
   npm start
   ```

## Umgebungsvariablen

- `PORT` - Server Port (Standard: 3000)
- `MONGODB_URI` - MongoDB Verbindungs-URL
- `MAX_FILE_SIZE` - Maximale Dateigröße in Bytes (Standard: 10MB)
- `SMTP_HOST` - SMTP Server für E-Mail-Versand
- `SMTP_PORT` - SMTP Port
- `SMTP_USER` - SMTP Benutzername
- `SMTP_PASS` - SMTP Passwort
- `SMTP_FROM` - Absender-E-Mail-Adresse

## Entwicklung

### Voraussetzungen

- Node.js >= 14
- MongoDB
- SMTP Server für E-Mail-Versand

### Code-Struktur

```
backend/
├── src/
│   ├── controllers/     # Request Handler
│   ├── models/         # Datenbank Models
│   ├── routes/         # API Routen
│   ├── services/       # Business Logic
│   ├── swagger.js      # API Dokumentation
│   └── index.js        # App Entry Point
├── uploads/           # Uploaded Files
├── .env              # Environment Variables
└── package.json
```

## Sicherheit

- Alle Dokumente sind nur über einen einzigartigen Access Token zugänglich
- PDF-Dateien werden validiert
- Signaturfelder können nur vom Ersteller platziert werden
- Audit-Trail für alle Änderungen
- E-Mail-Benachrichtigungen bei wichtigen Aktionen

## Lizenz

MIT
