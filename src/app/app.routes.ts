import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'editor',
    pathMatch: 'full'
  },
  {
    path: 'editor',
    loadComponent: () => import('./components/template-editor/template-editor.component')
      .then(m => m.TemplateEditorComponent)
  }
];
