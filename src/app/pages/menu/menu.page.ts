import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Capture, User } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CameraService } from 'src/app/services/camera/camera.service';

import { ThemeColorsService } from 'src/app/services/themeColors/themeColors.service';
import { UsersService } from 'src/app/services/users/users.service';
import { ChartPage } from './chart/chart.page';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  //Variables
  language: string = this.translateService.currentLang;
  idCapture: number;
  imageUrl: string;
  userLogged: User = {} as User;
  darkValue: any;
  photoReturn: Capture;
  subscription: Subscription;
  xAxes: string;
  yAxes: string;
  votes: string;

  pages = [
    {
      title: this.translateService.instant('menu.captures'),
      url: '/menu/first',
      icon: 'images-outline',
    },
    {
      title: this.translateService.instant('menu.settings'),
      url: '/menu/usersettings',
      icon: 'settings-outline',
    },
    {
      title: this.translateService.instant('menu.chart'),
      url: '/menu/chart',
      icon: 'bar-chart-outline',
    },
    {
      title: this.translateService.instant('menu.about'),
      url: '/menu/about',
      icon: 'information-circle-outline',
    },
  ];

  selectedPath = '';

  constructor(
    private authService: AuthService,
    private cameraService: CameraService,
    private router: Router,
    private themeColorsService: ThemeColorsService,
    private userService: UsersService,
    private translateService: TranslateService,
    private chartPage: ChartPage
  ) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event && event.url) {
        this.selectedPath = event.url;
      }
    });
  }

  ngOnInit() {
    this.darkValue = this.darkBookean;
    this.getUserData();
  }

  async takePhoto() {
    this.cameraService
      .takePhoto()
      .then((photoReturn) => {
        this.imageUrl = photoReturn['imageUrl'];
        this.idCapture = Number(photoReturn['idCapture']);
        this.router.navigate([
          '../../menu/first/detail/',
          this.imageUrl,
          this.idCapture,
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getUserData() {
    this.subscription = this.userService.onMessage().subscribe((response) => {
      this.userLogged = response.user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['welcome']);
  }

  get darkBookean() {
    return this.themeColorsService.sharedDarkValue;
  }

  setTheme(ev) {
    this.themeColorsService.setAppTheme(ev.detail.checked);
  }

  async languageChange() {
    this.translateService.use(this.language);

    this.translateService.get('menu.captures').subscribe((trad) => {
      this.pages[0].title = trad;
    });

    this.translateService.get('menu.settings').subscribe((trad) => {
      this.pages[1].title = trad;
    });

    this.translateService.get('menu.chart').subscribe((trad) => {
      this.pages[2].title = trad;
    });

    this.translateService.get('menu.about').subscribe((trad) => {
      this.pages[3].title = trad;
    });

    this.translateService.get('chart.xAxes').subscribe((trad) => {
      this.xAxes = trad;
    });

    this.translateService.get('chart.yAxes').subscribe((trad) => {
      this.yAxes = trad;
    });

    this.translateService.get('chart.votes').subscribe((trad) => {
      this.votes = trad;
    });

    //this.chartPage.updateLangChanges(this.xAxes, this.yAxes, this.votes);
  }
}
