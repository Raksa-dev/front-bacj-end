import { Component } from '@angular/core';

import { USER_DASHBOARD } from '../../constants/userconstants';
import { Router } from '@angular/router';
import confetti from 'canvas-confetti';
import { UserService, AuthService } from 'src/app/core/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(
    public router: Router,
    public userService: UserService,
    public authService: AuthService
  ) {
    if (localStorage.getItem('userScreen') == 'true') {
      localStorage.removeItem('userScreen');
      localStorage.setItem('userType', 'user');
      if (localStorage.getItem('newuser') == 'true') {
        this.confitee = true;
        this.launchConfetti();
        localStorage.removeItem('newuser');
      } else {
        window.location.reload();
      }
    }
  }

  launchConfetti(): void {
    confetti({
      particleCount: 1000,
      spread: 360,
      origin: { x: 0.5, y: 0.5 },
    });
  }
  public section: any = USER_DASHBOARD.main;
  public selectedCategory = null;

  tooltipVisible = null;
  confitee = false;
  // tooltipX = '0px';
  // tooltipY = '0px';

  showTooltip(event: MouseEvent, menu) {
    this.tooltipVisible = menu;
    // this.tooltipX = event.clientX + 10 + 'px';
    // this.tooltipY = event.clientY + 10 + 'px';
  }
  hideConfitee() {
    this.confitee = false;
    window.location.reload();
  }
  hideTooltip() {
    this.tooltipVisible = null;
  }

  selectedCategoryClick(cat) {
    let list = [
      'Foreign Settlement',
      'Remedies',
      'Job VS Business',
      'Love',
      'Students',
      'Improving Sex Life',
      'Career Insights Problems',
      'Who Am I',
      'Muhurtha',
      'Today’s Panchanga',
      'Today’s prediction',
      'Horoscope Match',
    ];
    this.userService.fetchUserData(this.authService.activeUserValue?.uid);
    if (list.includes(cat)) {
      this.router.navigate([`/book`], { queryParams: { cat } });
      return;
    }

    this.selectedCategory = cat;
    if (cat == 'Know') {
      this.section = USER_DASHBOARD['know'];
    }
  }

  selectCategory(cat: string): void {
    this.router.navigate([`/book`], { queryParams: { cat } });
  }
}
