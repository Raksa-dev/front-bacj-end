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
  public section = USER_DASHBOARD.main;
  public selectedCategory = null;

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
    ];
    if (list.includes(cat)) {
      this.router.navigate([`/book`], { queryParams: { cat } });
      return;
    }

    this.selectedCategory = cat;
    if ((cat = 'Know')) {
      this.section = USER_DASHBOARD['know'];
    }
  }

  selectCategory(cat: string): void {
    this.router.navigate([`/book`], { queryParams: { cat } });
  }
}
