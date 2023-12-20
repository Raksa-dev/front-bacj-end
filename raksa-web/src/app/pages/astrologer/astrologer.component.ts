import { Component, OnInit } from '@angular/core';
import {
  AuthService,
  AstrologerService,
  UserService,
} from 'src/app/core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CallnotificationsComponent } from 'src/app/shared/callnotifications/callnotifications.component';
import { ChatnotificationsComponent } from 'src/app/shared/chatnotifications/chatnotifications.component';
import { ProfileComponent } from 'src/app/shared/profile/profile.component';

@Component({
  selector: 'app-astrologer',
  templateUrl: './astrologer.component.html',
  styleUrls: ['./astrologer.component.scss'],
})
export class AstrologerComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public astroServices: AstrologerService,
    public userService: UserService,
    private modalService: NgbModal
  ) {}
  userData;
  notificationData;
  fetchUserData() {
    this.userService
      .getUserDataInfo(this.authService.activeUserValue.uid)
      .then((userVal) => {
        this.userData = userVal;
        let count = this.astroServices.getnotificationCount();
        this.notificationData = {
          chatNotificaitionArray: count?.chatCount,
          callNotificaitionArray: count?.callCount,
        };

        this.userData = {
          ...userVal,
          chatCount: count?.chatCount?.length || 0,
          callCount: count?.callCount?.length || 0,
        };
      });
  }
  ngOnInit(): void {
    if (localStorage.getItem('astrologerScreen') == 'true') {
      window.location.reload();
      localStorage.removeItem('astrologerScreen');
    }
    this.fetchUserData();
  }
  openProfileModal(): void {
    const modalRef = this.modalService.open(ProfileComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
      scrollable: true,
    });
  }
  openChatNotiifcations() {
    const modelRef = this.modalService.open(ChatnotificationsComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
      scrollable: true,
    });
    modelRef.componentInstance.notificaitionData =
      this.notificationData?.chatNotificaitionArray;
  }
  openCallNotiifcations() {
    const modelRef = this.modalService.open(CallnotificationsComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
      scrollable: true,
    });
    modelRef.componentInstance.notificaitionData =
      this.notificationData?.callNotificaitionArray;
  }
}
