/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { User } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  userLogged: User;
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
    private router: Router,
    private authService: AuthService
    ) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event && event.url) {
        this.selectedPath = event.url;
      }
    });
  }

  ngOnInit() {

  }

  takePhoto(){
    alert('hola');
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['welcome']);
  }

  onToggleColorTheme(event) {
    if (event.detail.checked) {
      document.body.setAttribute('color-theme', 'dark');
      console.log(event.detail.checked);
    } else {
      document.body.setAttribute('color-theme', 'light');
      console.log(event.detail.checked);
    }
  }
}
