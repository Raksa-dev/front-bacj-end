import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Astrologer } from 'src/app/core/models';
import { AstrologerService, UserService } from 'src/app/core/services';
import { AuthService } from 'src/app/core/services/auth.service';
import { CalluiComponent } from 'src/app/shared/callui/callui.component';
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
  toast = false;
  message = '';
  constructor(
    private modalService: NgbModal,
    public authService: AuthService,
    public astroServices: AstrologerService,
    public userService: UserService
  ) {}

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

  resetToast() {
    this.toast = false;
  }

  openChatWindow() {
    if (this.authService.activeUserValue) {
      this.modalService.open(CalluiComponent, {
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
  openWallet() {
    this.modalService.dismissAll();
    // top up balance
    const modalRef = this.modalService.open(WalletComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
      scrollable: true,
    });
  }
  openConfirmation(content) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        backdrop: 'static',
        keyboard: false,
        centered: true,
        size: 'lg',
        scrollable: true,
      })
      .result.then();
  }
  sendChatNotificationToAstrologer(astroData, content) {
    if (this.authService.activeUserValue) {
      let checkBalance = astroData['chatChargePerMinute'] * 5;

      if (this.userData.walletBalance > checkBalance) {
        this.toast = true;
        this.userService
          .NotifyAstrologerForChat(
            astroData,
            this.userService.getUserData,
            'call'
          )
          .then((data) => {});
      } else {
        this.message = `Minimum balance of 5 minutes (${checkBalance} INR) is required to start call.`;
        this.openConfirmation(content);
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
