import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class menuPage implements OnInit {
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

  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event && event.url) {
        this.selectedPath = event.url;
      }
    });
  }

  ngOnInit() {}
}
