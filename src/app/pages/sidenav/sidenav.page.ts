import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.page.html',
  styleUrls: ['./sidenav.page.scss'],
})
export class SidenavPage implements OnInit {
  pages = [
    {
      title: 'List',
      url: '/sidenav/list',
      icon: 'albums',
    },
    {
      title: 'About',
      url: '/sidenav/about',
      icon: 'albums',
    },
    {
      title: 'Settings',
      url: '/sidenav/usersettings',
      icon: 'albums',
    },
  ];

  active = '';

  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.active = event.url;
    });
  }

  ngOnInit() {}
}
