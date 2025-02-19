import { bootstrapApplication } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .then((appRef) => {
    const translate = appRef.injector.get(TranslateService);
    translate.setDefaultLang('es');
    translate.use('es');
  })
  .catch((err) => console.error(err));
