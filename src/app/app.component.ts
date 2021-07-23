import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private translateService: TranslateService) {
    //translateService.setDefaultLang('ca');

    const lng = this.translateService.getBrowserLang();
    this.translateService.setDefaultLang(lng);
    this.translateService.use(lng);
    const supportedLangs = ['ca', 'es', 'en'];
    supportedLangs.forEach((language) => {
      this.translateService.reloadLang(language);
    });
  }

  ngOnInit() {}
}
