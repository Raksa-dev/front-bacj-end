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
    this.selectedCategory = cat;
  }

  selectCategory(cat: string): void {
    this.router.navigate([`/book`], { queryParams: { cat } });
  }
}
