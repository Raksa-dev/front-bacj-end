import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Astrologer } from 'src/app/core/models';
import { AstrologerService, UserService } from 'src/app/core/services';
import { AuthService } from 'src/app/core/services/auth.service';
import { ChatuiComponent } from 'src/app/shared/chatui/chatui.component';
import { LoginComponent } from 'src/app/shared/login/login.component';
import { ProfileComponent } from 'src/app/shared/profile/profile.component';
import { WalletComponent } from 'src/app/shared/wallet/wallet.component';

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss'],
})
export class CallComponent implements OnInit {
  userData = null;
  constructor(
    private modalService: NgbModal,
    public authService: AuthService,
    public astroServices: AstrologerService,
    public userService: UserService
  ) {}
  // public astrologers: Astrologer[] = [
  //   {
  //     _id: 1,
  //     avatar: '../../../assets/images/astrologer/avatar-1.png',
  //     astrologerName: 'Pandit Pradeep',
  //     experience: '10+ years of experience',
  //     tags: 'Palm reading, Tarrot Cards, Numerology',
  //     rating: 4.5,
  //     reviews: 1000,
  //     online: true,
  //   },
  //   {
  //     _id: 2,
  //     avatar: '../../../assets/images/astrologer/avatar-2.png',
  //     astrologerName: 'Yadav Raj',
  //     experience: '30+ years of experience',
  //     tags: 'Vedic astrologer, Vastu expert',
  //     rating: 4.5,
  //     reviews: 2500,
  //     online: false,
  //   },
  //   {
  //     _id: 3,
  //     avatar: '../../../assets/images/astrologer/avatar-3.png',
  //     astrologerName: 'Pandit Pradeep',
  //     experience: '10+ years of experience',
  //     tags: 'Palm reading, Tarrot Cards, Numerology',
  //     rating: 4.5,
  //     reviews: 1000,
  //     online: true,
  //   },
  //   {
  //     _id: 4,
  //     avatar: '../../../assets/images/astrologer/avatar-4.png',
  //     astrologerName: 'Yadav Raj',
  //     experience: '30+ years of experience',
  //     tags: 'Vedic astrologer, Vastu expert',
  //     rating: 4.5,
  //     reviews: 2500,
  //     online: true,
  //   },
  //   {
  //     _id: 5,
  //     avatar: '../../../assets/images/astrologer/avatar-5.png',
  //     astrologerName: 'Pandit Pradeep',
  //     experience: '10+ years of experience',
  //     tags: 'Palm reading, Tarrot Cards, Numerology',
  //     rating: 4.5,
  //     reviews: 1000,
  //     online: true,
  //   },
  //   {
  //     _id: 6,
  //     avatar: '../../../assets/images/astrologer/avatar-6.png',
  //     astrologerName: 'Yadav Raj',
  //     experience: '30+ years of experience',
  //     tags: 'Vedic astrologer, Vastu expert',
  //     rating: 4.5,
  //     reviews: 2500,
  //     online: false,
  //   },
  //   {
  //     _id: 7,
  //     avatar: '../../../assets/images/astrologer/avatar-7.png',
  //     astrologerName: 'Pandit Pradeep',
  //     experience: '10+ years of experience',
  //     tags: 'Palm reading, Tarrot Cards, Numerology',
  //     rating: 4.5,
  //     reviews: 1000,
  //     online: true,
  //   },
  //   {
  //     _id: 8,
  //     avatar: '../../../assets/images/astrologer/avatar-1.png',
  //     astrologerName: 'Yadav Raj',
  //     experience: '30+ years of experience',
  //     tags: 'Vedic astrologer, Vastu expert',
  //     rating: 4.5,
  //     reviews: 2500,
  //     online: true,
  //   },
  //   {
  //     _id: 8,
  //     avatar: '../../../assets/images/astrologer/avatar-1.png',
  //     astrologerName: 'Yadav Raj',
  //     experience: '30+ years of experience',
  //     tags: 'Vedic astrologer, Vastu expert',
  //     rating: 4.5,
  //     reviews: 2500,
  //     online: true,
  //   },
  // ];

  public astrologersData = [];
  ngOnInit(): void {
    this.astroServices.getAllAstrologersData().then((data) => {
      data.forEach((doc) => {
        this.astrologersData.push(doc.data());
      });
    });
    this.userService
      .getUserDataInfo(this.authService.activeUserValue.uid)
      .then((userVal) => {
        this.userData = userVal;
      });
  }

  public openFilter(content: any): void {
    const modalRef = this.modalService
      .open(content, {
        backdrop: 'static',
        keyboard: false,
        centered: true,
        size: 'lg',
      })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  openChatWindow() {
    if (this.authService.activeUserValue) {
      this.modalService.open(ChatuiComponent, {
        backdrop: 'static',
        keyboard: false,
        centered: true,
        size: 'lg',
        scrollable: true,
      });
    } else {
      const modalRef = this.modalService.open(LoginComponent, {
        backdrop: 'static',
        keyboard: false,
        centered: true,
        size: 'lg',
        modalDialogClass: 'login',
      });
    }
  }
  sendChatNotificationToAstrologer(astroData) {
    if (this.authService.activeUserValue) {
      if (this.userData.walletBalance > astroData['callChargePerMinute']) {
        this.userService
          .NotifyAstrologerForChat(astroData, this.userService.getUserData,'call')
          .then((data) => {});
      } else {
        // top up balance
        const modalRef = this.modalService.open(WalletComponent, {
          backdrop: 'static',
          keyboard: false,
          centered: true,
          size: 'lg',
          scrollable: true,
        });
      }
    } else {
      const modalRef = this.modalService.open(LoginComponent, {
        backdrop: 'static',
        keyboard: false,
        centered: true,
        size: 'lg',
        modalDialogClass: 'login',
      });
    }
  }
}
