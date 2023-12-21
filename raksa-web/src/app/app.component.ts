import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './shared/login/login.component';
import { ProfileComponent } from './shared/profile/profile.component';
import { ActivatedRoute, Router } from '@angular/router';

import { AstrologerService, AuthService, UserService } from './core/services';
import { ChatnotificationsComponent } from './shared/chatnotifications/chatnotifications.component';
import { CallnotificationsComponent } from './shared/callnotifications/callnotifications.component';

import {
  Firestore,
  collectionData,
  collection,
  where,
  query,
} from '@angular/fire/firestore';
import { WalletComponent } from './shared/wallet/wallet.component';
import { TransactionComponent } from './shared/transaction/transaction.component';
import { SessionsComponent } from './shared/sessions/sessions.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    public userServices: UserService,
    public router: Router,
    public astroServices: AstrologerService,
    public firestore: Firestore
  ) {}

  title = 'Raksa';
  public isScrolled: boolean;

  public formStep: number = 1;
  public selectedCountry: number = 1;
  public showHeader: boolean = true;
  public showFooter: boolean = true;
  public isAstrologerPage: boolean = false;
  public currentUser = this.userServices.getUserData;
  public userData;
  public chatNotificaitionArray;
  public callNotificaitionArray;
  public showThreeNavs = true;
  public showNotificationNavs = false;

  public otpInputConfig = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
  };

  private async fetchNotificationData() {
    const coll = collection(
      this.firestore,
      'notifications',
      this.authService.activeUserValue['uid'],
      'notifications'
    );
    const q1 = query(
      coll,
      where('type', '==', 'chat'),
      where('isRead', '==', false)
    );
    const q2 = query(
      coll,
      where('type', '==', 'call'),
      where('isRead', '==', false)
    );
    const realNotificationChat = collectionData(q1, { idField: 'id' });
    const realNotificationCall = collectionData(q2, { idField: 'id' });

    realNotificationChat.subscribe((data) => {
      this.chatNotificaitionArray = data;
      this.astroServices.setUserNotificationCount({
        chatCount: this.chatNotificaitionArray,
        callCount: this.callNotificaitionArray,
      });
    });
    realNotificationCall.subscribe((data) => {
      this.callNotificaitionArray = data;
      this.astroServices.setUserNotificationCount({
        chatCount: this.chatNotificaitionArray,
        callCount: this.callNotificaitionArray,
      });
    });
  }
  fetchUserData() {
    this.userServices
      .fetchUserData(this.authService.activeUserValue['uid'])
      .then((data) => {
        this.userData = data;
      });
  }

  ngOnInit() {
    if (this.authService.activeUserValue) {
      this.fetchNotificationData();
      this.fetchUserData();
      this.showNotificationNavs = true;
    }
    localStorage.removeItem('user-sign-up-data');
    localStorage.removeItem('relative-data');
    this.activatedRoute.queryParams.subscribe((params) => {
      let routesArray = window.location?.pathname?.split('/');

      if (routesArray.includes('transaction')) {
        this.showHeader = false;
        this.showFooter = false;
        // redirect to transaction page
        // this.router.navigateByUrl('/transaction');
      }
      if (routesArray.includes('astrologer')) {
        this.isAstrologerPage = true;
        this.showThreeNavs = false;
        this.showFooter = false;

        // redirect to transaction page
        this.router.navigateByUrl('/astrologer');
      }
      if (params['code'] && params['code'].length == 6) {
        const modalRef = this.modalService.open(LoginComponent, {
          backdrop: 'static',
          keyboard: false,
          centered: true,
          size: 'lg',
          modalDialogClass: 'login',
        });
      }
    });
  }

  login(): void {
    const modalRef = this.modalService.open(LoginComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
      modalDialogClass: 'login',
    });

    modalRef.result.then((res) => {
      if (res['response']) {
        // this.getAcademicSessions();
        // this.switchAcademicSession(res['data']);
      }
    });
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
    modelRef.componentInstance.notificaitionData = this.chatNotificaitionArray;
  }
  openCallNotiifcations() {
    const modelRef = this.modalService.open(CallnotificationsComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
      scrollable: true,
    });
    modelRef.componentInstance.notificaitionData = this.callNotificaitionArray;
  }

  openWalletModal(): void {
    const modalRef = this.modalService.open(WalletComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
      scrollable: true,
    });
  }

  openTransactionModal(): void {
    const modalRef = this.modalService.open(TransactionComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
      scrollable: true,
      fullscreen: true,
    });
  }
  openSessionModal() {
    const modalRef = this.modalService.open(SessionsComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
      scrollable: true,
      fullscreen: true,
    });
  }

  async logout() {
    this.showNotificationNavs = false;
    this.showThreeNavs = true;
    if (this.userData?.isAstrologer) {
      await this.userServices.UpdateAstroUser(
        this.authService.activeUserValue['uid'],
        {
          isOnline: false,
        }
      );
    }
    this.authService.SignOut();
  }
}
