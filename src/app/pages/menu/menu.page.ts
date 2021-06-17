import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { ThemeColorsService } from 'src/app/services/themeColors/themeColors.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class menuPage implements OnInit {
  //Variables
  selectedPath = '';
  darkValue: any;

  //Define array of pages
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

  constructor(
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

  get darkBookean() {
    return this.themeColorsService.sharedDarkValue;
  }

  setTheme(ev) {
    //console.log(ev);
    this.themeColorsService.setAppTheme(ev.detail.checked);
  }
}
