import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';
import { User } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CapturesService } from 'src/app/services/captures/captures.service';

import { ThemeColorsService } from 'src/app/services/themeColors/themeColors.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  
  //Variables 
  idCapture: number;
  imageName: string;
  imageUrl: string;
  userLogged: User;
  darkValue: any;
  photoReturn = [{ url: '', imageName: '' }];
  pages = [
    {
      title: 'First',
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
    private captureService: CapturesService,
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
    this.captureService
      .takePhoto()
      .then((photoReturn) => {
        console.log('I am in menu ' + photoReturn['imageName']);
        console.log('I am in menu ' + photoReturn['url']);
        this.imageUrl = photoReturn['url'];
        this.imageName = photoReturn['imageName']
        
        this.idCapture = Number(this.imageName.substring(0,10));
        console.log('String cutt ' +this.idCapture);

        this.router.navigate(['../../menu/first/detail/', this.imageUrl, this.idCapture]);

       
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
