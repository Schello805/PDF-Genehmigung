import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) 
  },
  { 
    path: 'upload', 
    loadComponent: () => import('./components/document-upload/document-upload.component').then(m => m.DocumentUploadComponent) 
  },
  { 
    path: 'view/:accessToken', 
    loadComponent: () => import('./components/document-viewer/document-viewer.component').then(m => m.DocumentViewerComponent) 
  },
  { 
    path: 'settings', 
    loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent) 
  },
  { 
    path: 'guide', 
    loadComponent: () => import('./components/guide/guide.component').then(m => m.GuideComponent) 
  }
];
