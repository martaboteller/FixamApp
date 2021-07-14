import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { Capture, User } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CameraService } from 'src/app/services/camera/camera.service';

import { ThemeColorsService } from 'src/app/services/themeColors/themeColors.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  //Variables
  idCapture: number;
  imageUrl: string;
  userLogged: User;
  darkValue: any;
  photoReturn: Capture;
  pages = [
    {
      title: 'Captures',
      url: '/menu/first',
      icon: 'images-outline',
    },
    {
      title: 'User settings',
      url: '/menu/usersettings',
      icon: 'settings-outline',
    },
    {
      title: 'About',
      url: '/menu/about',
      icon: 'information-circle-outline',
    },
  ];

  selectedPath = '';

  constructor(
    private authService: AuthService,
    private cameraService: CameraService,
    private router: Router,
    private themeColorsService: ThemeColorsService
  ) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event && event.url) {
        this.selectedPath = event.url;
      }
    });
  }

  ngOnInit() {
    this.darkValue = this.darkBookean;
    //console.log(this.darkValue);
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

  logout() {
    this.authService.logout();
    this.router.navigate(['welcome']);
  }

  get darkBookean() {
    return this.themeColorsService.sharedDarkValue;
  }

  setTheme(ev) {
    //console.log(ev);
    this.themeColorsService.setAppTheme(ev.detail.checked);
  }
}
