import { Component } from '@angular/core';

import { USER_DASHBOARD } from '../../constants/userconstants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(public router: Router) {
    if (localStorage.getItem('userScreen') == 'true') {
      window.location.reload();
      localStorage.removeItem('userScreen');
      localStorage.setItem('userType', 'user');
    }
  }
  public section: any = USER_DASHBOARD.main;
  public selectedCategory = null;

  tooltipVisible = null;
  // tooltipX = '0px';
  // tooltipY = '0px';

  showTooltip(event: MouseEvent, menu) {
    this.tooltipVisible = menu;
    // this.tooltipX = event.clientX + 10 + 'px';
    // this.tooltipY = event.clientY + 10 + 'px';
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
    ];
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
