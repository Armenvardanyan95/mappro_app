import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { HomePage } from '../home/home';
import { AuthService } from '../../app/services/auth.service';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  isAuth: boolean = true;

  home = HomePage;
  about = AboutPage;

  constructor(private authService: AuthService) {
    authService.authChanged.subscribe(isAuth => {
      this.isAuth = isAuth;
    });
  }
}
