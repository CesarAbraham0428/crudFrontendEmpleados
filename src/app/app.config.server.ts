import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(withInterceptorsFromDi())
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
