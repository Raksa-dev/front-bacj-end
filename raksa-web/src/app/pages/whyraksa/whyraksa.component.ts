import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from 'src/app/shared/login/login.component';

@Component({
  selector: 'app-whyraksa',
  templateUrl: './whyraksa.component.html',
  styleUrls: ['./whyraksa.component.scss'],
})
export class WhyraksaComponent {
  constructor(private modalService: NgbModal, route: Router) {
    let userType = localStorage.getItem('userType');
    if (userType == 'user') {
      route.navigateByUrl('/dashboard');
    }
  }
  onClick() {
    const modalRef = this.modalService.open(LoginComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
      modalDialogClass: 'login',
    });
  }
}
