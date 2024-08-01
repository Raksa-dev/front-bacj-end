import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from 'src/app/shared/login/login.component';

@Component({
  selector: 'app-ourstory',
  templateUrl: './ourstory.component.html',
  styleUrls: ['./ourstory.component.scss'],
})
export class OurstoryComponent {
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
