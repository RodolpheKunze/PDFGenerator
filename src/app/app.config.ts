import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { icons, LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    {provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons)}
  ]
};
