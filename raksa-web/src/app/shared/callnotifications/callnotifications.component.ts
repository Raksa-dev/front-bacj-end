import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatuiComponent } from '../chatui/chatui.component';
import {
  AstrologerService,
  AuthService,
  UserService,
} from 'src/app/core/services';
import { CalluiComponent } from '../callui/callui.component';

@Component({
  selector: 'app-callnotifications',
  templateUrl: './callnotifications.component.html',
  styleUrls: ['./callnotifications.component.scss'],
})
export class CallnotificationsComponent {
  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public authService: AuthService,
    public astroService: AstrologerService,
    public userservice: UserService
  ) {}

  @Input() notificaitionData;

  ngOnInit(): void {}
  async openChatWindow(notificationData) {
    // steps
    // 1.create room code and room
    // 2 send notification to user to chat with astro in that send room code if possible
    // 3.send room detaisl to chatui compoment plus user tpye
    // 4.once room created please don't create the room instead direclt take him to the room
    // let roomCode;
    if (this.userservice.getUserData['isAstrologer']) {
      // if this user is astrologer
      const alreadyNotificationPresent =
        await this.userservice.checkNotificationIsThere(
          notificationData['senderId'],
          this.userservice.getUserData['uid'],
          'call'
        );

      if (alreadyNotificationPresent?.size) {
   
        // if notification is already present don't send the notificaition to user
        let notificationDataFetch = alreadyNotificationPresent.docs[0].data();

        this.activeModal.close({ response: false });

        let modelRef = this.modalService.open(CalluiComponent, {
          backdrop: 'static',
          keyboard: false,
          centered: true,
          size: 'lg',
          scrollable: true,
        });
        notificationDataFetch['id'] = notificationData['id'];
        modelRef.componentInstance.parentData = {
          userIsAstrologer: this.userservice.getUserData['isAstrologer'],
          notificationData: notificationDataFetch,
          user: this.userservice.getUserData,
        };
      } else {
        // if notification been not sent to user
        // genrate the room code
        // and send the notificatin to the user with room code
        const roomCode = (
          await this.astroService.generateRoomCodeForCall(
            this.userservice.getUserData['uid'] +
              '_' +
              notificationData['senderId']
          )
        ).subscribe(async (data) => {
          let codeOfSpeaker = data['roomCode'].data.filter(
            (data) => data.role == 'speaker'
          );
          const notify = await this.userservice.NotifyUserForChat(
            this.userservice.getUserData,
            notificationData,
            'call',
            codeOfSpeaker[0].code
          );
          this.activeModal.close({ response: false });

          let modelRef = this.modalService.open(CalluiComponent, {
            backdrop: 'static',
            keyboard: false,
            centered: true,
            size: 'lg',
            scrollable: true,
          });
          notificationData['callRoomCode'] = codeOfSpeaker[0].code;
          modelRef.componentInstance.parentData = {
            userIsAstrologer: this.userservice.getUserData['isAstrologer'],
            notificationData: notificationData,
            user: this.userservice.getUserData,
          };
        });
      }
    } else {
      // if this user is a simple user

      this.activeModal.close({ response: false });

      let modelRef = this.modalService.open(CalluiComponent, {
        backdrop: 'static',
        keyboard: false,
        centered: true,
        size: 'lg',
        scrollable: true,
      });
      modelRef.componentInstance.parentData = {
        userIsAstrologer: this.userservice.getUserData['isAstrologer'],
        notificationData,
        user: this.userservice.getUserData,
      };
    }
  }

  onCancel(): void {
    this.activeModal.close({ response: false });
  }
}
