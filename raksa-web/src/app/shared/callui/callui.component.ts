import { Component, OnInit, OnDestroy, Input, NgZone } from '@angular/core';
// @ts-ignore
import UAParser from 'ua-parser-js';
import {
  HMSReactiveStore,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
  selectPeers,
  selectIsConnectedToRoom,
  HMSNotificationTypes,
} from '@100mslive/hms-video-store';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, interval } from 'rxjs';
import { AuthService, UserService } from 'src/app/core/services';
import { increment } from 'firebase/firestore';

@Component({
  selector: 'app-callui',
  templateUrl: './callui.component.html',
  styleUrls: ['./callui.component.scss'],
})
export class CalluiComponent implements OnInit, OnDestroy {
  @Input() parentData;

  hmsManager: HMSReactiveStore;
  hmsStore: any;
  htmNotifications: any;
  astrologerData = null;
  currentUser = this.userService?.getUserData;

  hmsActions: any;
  renderedPeerIDs = new Set();
  peersContainer: HTMLElement;
  leaveBtn: HTMLElement;
  muteAudio: HTMLElement;
  muteVideo: HTMLElement;
  form: HTMLElement;
  conference: HTMLElement;
  controls: HTMLElement;
  joinedCall = false;
  muteLocalPeer = false;
  peers = [];
  confirmationOverlay: boolean = false;

  timer: number = 0;
  timerSubscription: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private ngZone: NgZone,
    public userService: UserService,
    public authService: AuthService
  ) {
    // Initialize HMS Store
    this.hmsManager = new HMSReactiveStore();
    this.hmsManager.triggerOnSubscribe();
    this.hmsStore = this.hmsManager.getStore();
    this.hmsActions = this.hmsManager.getActions();
    this.htmNotifications = this.hmsManager.getNotifications();
  }

  startTimer() {
    this.ngZone.runOutsideAngular(() => {
      this.timerSubscription = interval(1000).subscribe(() => {
        this.ngZone.run(() => {
          this.timer++;
          // this.checkTheBalance();
        });
      });
    });
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  ngOnInit(): void {
    const storedTimer = localStorage.getItem('callTimer');
    this.timer = storedTimer ? parseInt(storedTimer, 10) : 0;
    window.onbeforeunload = () => {
      localStorage.setItem('callTimer', this.timer.toString());
    };
    // Initialize your code here
    this.hmsManager.triggerOnSubscribe();
    this.hmsStore.subscribe(this.onConnection, selectIsConnectedToRoom);

    this.htmNotifications.onNotification((notification) => {
      // This function will be called when a notification is received
      // The data in notification depends on the notification type

      this.peers = notification.data;
    }, HMSNotificationTypes.PEER_LIST);

    this.htmNotifications.onNotification(
      (notification) => {
        if (!notification) {
          return;
        }
        if (HMSNotificationTypes.PEER_JOINED == notification.type) {
          this.peers.push(notification.data);
        }
        if (HMSNotificationTypes.PEER_LEFT == notification.type) {
          this.peers = this.peers.filter(
            (data) => data.id != notification.data.id
          );
        }
      },
      [HMSNotificationTypes.PEER_JOINED, HMSNotificationTypes.PEER_LEFT]
    );
    if (!this.parentData.userIsAstrologer) {
      this.astroData().then((data) => {
        this.astrologerData = data;
      });
    }
  }

  async astroData() {
    let astrologerData = await this.userService.getUserDataInfo(
      this.parentData.notificationData['senderId']
    );
    return astrologerData;
  }

  openConfirmation(): void {
    this.confirmationOverlay = true;
  }

  continue(): void {
    this.confirmationOverlay = false;
  }

  ngOnDestroy(): void {
    // Clean up code here
    // this.leaveRoom();
    this.leavehmsStore();
    this.timerSubscription.unsubscribe();
    window.onbeforeunload = null;
  }

  onCancel(): void {
    if (this.joinedCall) {
      localStorage.setItem('callTimer', this.timer.toString());
      this.timerSubscription.unsubscribe();
      window.onbeforeunload = null;
    }
    this.joinedCall = false;
    this.activeModal.close({ response: false });
  }
  async leavehmsStore() {
    await this.hmsActions.leave();
  }

  calculateRate(rate, sec) {
    const ratePerMinute = rate; // Rs per minute
    const seconds = sec;

    // Convert seconds to minutes
    const minutes = seconds / 60;

    // Calculate the cost
    const cost = ratePerMinute * minutes;

    // Round the cost to two decimal places
    const roundedCost = Math.round(cost * 100) / 100;
    return roundedCost;
  }

  async deductBalanceFromUserAccount(uid, amount) {
    if (this.currentUser && this.currentUser['walletBalance']) {
      const data = await this.userService.UpdateUser(uid, {
        walletBalance:
          this.currentUser['walletBalance'] - Math.round(amount * 100) / 100,
      });

      return data;
    }
  }
  async addBalanceToAstrolgerAccount(uid, amount) {
    if (this.currentUser && this.currentUser['walletBalance']) {
      const data = await this.userService.UpdateUser(uid, {
        walletBalance: increment(amount),
      });

      return data;
    }
  }
  async leaveRoom() {
    if (!this.parentData.userIsAstrologer) {
      let astrologerData = this.astrologerData;

      let charge = this.calculateRate(
        astrologerData['callChargePerMinute'],
        this.timer
      );

      // save in session data base
      this.deductBalanceFromUserAccount(this.currentUser.uid, charge).then(
        async (data) => {
          await this.userService.createEntryInSession({
            amount: Math.round(charge * 100) / 100,
            astrologerId: this.parentData.notificationData['senderId'],
            callDuration: this.timer,
            callerId: this.currentUser.uid,
            sessionType: 'call',
          });

          await this.addBalanceToAstrolgerAccount(
            this.parentData.notificationData['senderId'],
            Math.round(charge * 100) / 100
          );
        }
      );
    }
    this.joinedCall = false;
    this.peers = [];
    this.confirmationOverlay = false;
    this.leavehmsStore();
    this.onCancel();
    this.userService.MarkNotificationForChatAsRead(
      this.authService.activeUserValue['uid'],
      this.parentData?.notificationData['id']
    );
    const storedTimer = localStorage.removeItem('callTimer');
  }
  async previewRoom() {
    const authToken = await this.hmsActions.getAuthTokenByRoomCode({
      roomCode: this.parentData?.notificationData?.callRoomCode,
    });
    this.hmsActions.preview({
      userName: this.parentData?.user?.firstName,
      authToken,
    });
  }
  async joinRoom() {
    const authToken = await this.hmsActions.getAuthTokenByRoomCode({
      roomCode: this.parentData?.notificationData?.callRoomCode,
    });
    this.hmsActions.join({
      userName: this.parentData?.user?.firstName,
      authToken,
    });
    this.startTimer();
    this.joinedCall = true;
  }

  // Mute and unmute audio
  muteAudioClick() {
    const audioEnabled = !this.hmsStore.getState(selectIsLocalAudioEnabled);
    this.hmsActions.setLocalAudioEnabled(audioEnabled);
    this.muteLocalPeer = !audioEnabled;
  }

  // Mute and unmute video
  muteVideoClick() {
    const videoEnabled = !this.hmsStore.getState(selectIsLocalVideoEnabled);
    this.hmsActions.setLocalVideoEnabled(videoEnabled);
    this.muteVideo.textContent = videoEnabled ? 'Hide' : 'Unhide';
  }

  closeOverlay() {
    this.confirmationOverlay = false;
  }

  // Showing the required elements on connection/disconnection
  onConnection(isConnected: boolean) {
    if (isConnected) {
      // this.renderPeers();
      // this.form.classList.add('hide');
      // this.conference.classList.remove('hide');
      // this.leaveBtn.classList.remove('hide');
      // this.controls.classList.remove('hide');
    } else {
      // this.form.classList.remove('hide');
      // this.conference.classList.add('hide');
      // this.leaveBtn.classList.add('hide');
      // this.controls.classList.add('hide');
    }
  }
}
