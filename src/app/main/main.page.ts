import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss'],
})
export class MainPage implements OnInit {
  active = '';

  NAV = [
    {
      name: 'About',
      link: '/nav/about',
      icon: 'person-circle',
    },
    {
      name: 'Blog',
      link: '/nav/blog',
      icon: 'albums',
    },
    {
      name: 'Contact',
      link: '/nav/contact',
      icon: 'call',
    },
  ];

  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.active = event.url;
    });
  }

  ngOnInit() {}
}
