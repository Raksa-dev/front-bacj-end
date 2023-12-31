import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnDestroy,
  OnInit,
  NgZone,
  ElementRef,
  ViewChild,
  inject,
  Input,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import {
  Firestore,
  collectionData,
  collection,
  doc,
  onSnapshot,
  getDoc,
  addDoc,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { Auth } from 'firebase/auth';
import { Subscription, interval } from 'rxjs';
import {
  AuthService,
  UserService,
  WindowRefService,
} from 'src/app/core/services';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';
import { async } from '@angular/core/testing';
import { increment } from 'firebase/firestore';
import { WalletComponent } from '../wallet/wallet.component';

@Component({
  selector: 'app-chatui',
  templateUrl: './chatui.component.html',
  styleUrls: ['./chatui.component.scss'],
})
export class ChatuiComponent implements OnInit, OnDestroy {
  @Input() parentData;

  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    // private auth: Auth,
    public authService: AuthService,
    public userService: UserService,
    public windowRefService: WindowRefService,
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    private ngZone: NgZone,
    public firestore: Firestore,
    private modalService: NgbModal
  ) {}
  private readonly storage: Storage = inject(Storage);

  currentUser = this.userService?.getUserData;
  astrologerData = null;
  messageText: string = '';
  timer: number = 0;
  timerSubscription: Subscription;
  confirmationOverlay: boolean = false;
  imagePreview: string | null = null;
  sendImageInMessage = false;
  downloadFile = false;
  relations;
  openUserData = false;
  rechargeWallet: boolean = false;

  messages;
  message = '';

  selectedStars = 0;
  maxStars = 5;
  textArea = '';
  reviewSubmitted = false;

  ngOnInit() {
    const storedTimer = localStorage.getItem('chatTimer');
    this.timer = storedTimer ? parseInt(storedTimer, 10) : 0;
    this.ngZone.runOutsideAngular(() => {
      this.startTimer();
    });
    window.onbeforeunload = () => {
      localStorage.setItem('chatTimer', this.timer.toString());
    };
    if (!this.parentData.userIsAstrologer) {
      this.astroData().then((data) => {
        this.astrologerData = data;
      });
    }

    this.fetchData();
  }

  async fetchData() {
    const chatRoomCollection = collection(
      this.firestore,
      `chatRooms`,
      this.parentData.roomCode,
      'messages'
    );

    const q = query(chatRoomCollection, orderBy('time'));

    const newData = collectionData(q);

    newData.subscribe((data) => {
      this.messages = data;
      setTimeout(() => {
        this.scrollToBottom();
      }, 0);
    });
  }

  getStarColor(index: number): string {
    return index <= this.selectedStars ? 'white' : 'gold'; // Change this to the desired colors
  }
  openConfirmation(): void {
    this.confirmationOverlay = true;
  }
  closeRechargeWalletOverlay() {
    this.rechargeWallet = false;
    this.endChat();
  }

  continue(): void {
    this.confirmationOverlay = false;
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
        walletBalance: this.currentUser['walletBalance'] - amount,
      });

      return data;
    }
  }
  async addBalanceToAstrolgerAccount(uid, amount) {
    if (this.currentUser && this.currentUser['walletBalance']) {
      const roundedAmount = Math.round(amount * 100) / 100;

      const data = await this.userService.UpdateUser(uid, {
        walletBalance: increment(roundedAmount),
      });

      return data;
    }
  }

  async astroData() {
    let astrologerData = await this.userService.getUserDataInfo(
      this.parentData.notificationData['senderId']
    );
    return astrologerData;
  }

  refreshScreen() {
    this.userService.fetchUserData(this.currentUser['uid']).then((data) => {
      this.currentUser = data;
      let trackBalance =
        this.currentUser['walletBalance'] -
        this.calculateRate(
          this.astrologerData['chatChargePerMinute'],
          this.timer
        );
      let checkBalance = this.astrologerData['chatChargePerMinute'] * 5;
      if (
        trackBalance - checkBalance >=
        this.astrologerData['chatChargePerMinute']
      ) {
        // end the call top up the wallet to continue
        this.message = ``;
        this.rechargeWallet = false;
      }
    });
  }

  async submitReview() {
    if (this.parentData?.userIsAstrologer) {
      this.endChat();
      return;
    }
    this.confirmationOverlay = false;
    this.reviewSubmitted = true;
    // this.reviewSubmissionAndCalculation('helllo');
  }
  async onClickReivewSubmitButton() {
    this.endChat('review');
  }
  onTextareaChange(event: Event): void {
    // Handle the change event here
    const value = (event.target as HTMLTextAreaElement).value;
    this.textArea = value?.trim();
    // You can perform further actions with the value as needed
  }

  calculateOverAllRating(astrologerData) {
    if (astrologerData?.ratings && astrologerData?.totalReview) {
      let data: { [key: number]: number } = astrologerData?.ratings;
      const total = Object.entries(data).reduce(
        (acc, [key, value]) => acc + Number(key) * value,
        0
      );
      return Math.round(total / astrologerData?.totalReview);
    }
    return Math.round(this.selectedStars);
  }
  calculateRating(astrologerData) {
    if (
      astrologerData?.ratings &&
      Object.entries(astrologerData?.ratings).length
    ) {
      let ratings = astrologerData?.ratings;
      ratings[this.selectedStars] = ratings[this.selectedStars] + 1;
      return ratings;
    }
    let ratings = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratings[this.selectedStars] = ratings[this.selectedStars] + 1;
    return ratings;
  }

  async reviewSubmissionAndCalculation(sessionId) {
    let astrologerData = this.astrologerData;

    //create a entry in review and update review and overall rating in astrolger entry
    this.userService
      .UpdateAstroUser(this.parentData.notificationData['senderId'], {
        totalReview: astrologerData?.totalReview
          ? astrologerData?.totalReview + 1
          : 1,
        overallRating: astrologerData?.overallRating
          ? this.calculateOverAllRating(astrologerData)
          : this.selectedStars,
        ratings: this.calculateRating(astrologerData),
      })
      .then((data) => {});
    this.userService.createEntryReview({
      astrolgerId: astrologerData['uid'],
      userId: this.authService.activeUserValue?.uid,
      userName:
        this.currentUser['firstName'] + ' ' + this.currentUser['lastName'],
      userProfilePic: this.currentUser['profilePicUrl'],
      rating: this.selectedStars,
      reviewText: this.textArea,
      sessionType: 'chat',
      sessionId,
    });
  }

  async endChat(eventType?) {
    // the below contion is to get the astrolger pricring per min and parentData.userIsAstrologer false means this is a
    // user take sender id because sender is astrolger

    if (!this.parentData.userIsAstrologer) {
      let astrologerData = this.astrologerData;

      let charge = this.calculateRate(
        astrologerData['chatChargePerMinute'],
        this.timer
      );

      const min = 1000000000;
      const max = 9999999999;
      const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      let sessionId = `session_${randomNum}`;
      // save in session data base
      this.deductBalanceFromUserAccount(
        this.authService?.activeUserValue?.uid,
        charge
      ).then(async (data) => {
        await this.userService
          .createEntryInSession({
            amount: Math.round(charge * 100) / 100,
            astrologerId: this.parentData.notificationData['senderId'],
            astrologerName:
              astrologerData?.firstName + ' ' + astrologerData?.lastName,
            astrologerPic:
              astrologerData?.profilePicUrl || astrologerData?.linkToPhotoId||'',
            callDuration: this.timer,
            callerId: this.authService?.activeUserValue?.uid,
            callerName:
              this.currentUser.firstName + ' ' + this.currentUser?.lastName,
            callerPic:
              this.currentUser?.profilePicUrl ||
              this.currentUser?.linkToPhotoId ||
              '',
            sessionType: 'chat',
            sessionId,
          })
       

        await this.addBalanceToAstrolgerAccount(
          this.parentData.notificationData['senderId'],
          charge
        );
        await this.userService.createEntryPayment(
          {
            amount: charge,
            astrologerId: this.parentData.notificationData['senderId'],
            type: 'chat',
            userId: this.authService?.activeUserValue?.uid,
          },
          `payment_${randomNum}`
        );

        if (eventType && eventType == 'review') {
          await this.reviewSubmissionAndCalculation(sessionId);
        }
      });
    }
    // mark notification data as read
    const chatRoomCollection = collection(
      this.firestore,
      `chatRooms`,
      this.parentData.roomCode,
      'messages'
    );
    const docRef = await addDoc(chatRoomCollection, {
      text: 'User Has End The Chat',
      file_url: '',
      isRead: false,
      mediaUrl: '',
      message: 'User Has End The Chat',
      receiverId: '',
      receiverName: '',
      receiverPhotoUrl: '',
      senderId: this.authService?.activeUserValue?.uid,
      senderIsAstrologer: false,
      senderName: this.currentUser.firstName,
      senderPhotoUrl: this.currentUser?.profilePicUrl
        ? this.currentUser?.profilePicUrl
        : '',
      time: new Date(),
      type: 'text',
    });
    this.messageText = '';

    this.userService.MarkNotificationForChatAsRead(
      this.authService.activeUserValue['uid'],
      this.parentData?.notificationData['id']
    );

    this.confirmationOverlay = false;
    const storedTimer = localStorage.removeItem('chatTimer');
    this.openUserData = false;
    this.reviewSubmitted = false;
    this.activeModal.close({ response: false });
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.log(err);
    }
  }

  ngOnDestroy() {
    // Unsubscribe from the timer when the component is destroyed
    this.timerSubscription.unsubscribe();
    window.onbeforeunload = null;
  }
  checkTheBalance() {
    if (this.currentUser && this.currentUser['walletBalance']) {
      let trackBalance =
        this.currentUser['walletBalance'] -
        this.calculateRate(
          this.astrologerData['chatChargePerMinute'],
          this.timer
        );
      let checkBalance = this.astrologerData['chatChargePerMinute'] * 2;

      if (
        trackBalance - checkBalance <=
        this.astrologerData['chatChargePerMinute']
      ) {
        // end the call top up the wallet to continue
        this.message = `Minimum balance of 5 minutes (${checkBalance} INR) is required to start chat.`;
        this.rechargeWallet = true;
      }
    }
  }
  startTimer() {
    this.ngZone.runOutsideAngular(() => {
      this.timerSubscription = interval(1000).subscribe(() => {
        this.ngZone.run(() => {
          this.timer++;
          if (!this.parentData.userIsAstrologer) {
            this.checkTheBalance();
          }
        });
      });
    });
  }

  openWallet() {
    // top up balance
    const modalRef = this.modalService.open(WalletComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
      scrollable: true,
    });
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  async sendMessage(type: string = 'text', file_url: string = '') {
    try {
      if (this.messageText.trim() !== '') {
        const chatRoomCollection = collection(
          this.firestore,
          `chatRooms`,
          this.parentData.roomCode,
          'messages'
        );
        const docRef = await addDoc(chatRoomCollection, {
          text: this.messageText,
          file_url: file_url,
          isRead: false,
          mediaUrl: '',
          message: this.messageText,
          receiverId: '',
          receiverName: '',
          receiverPhotoUrl: '',
          senderId: this.currentUser.uid,
          senderIsAstrologer: false,
          senderName: this.currentUser?.firstName,
          senderPhotoUrl: this.currentUser?.profilePicUrl
            ? this.currentUser?.profilePicUrl
            : '',
          time: new Date(),
          type: type,
        });
        this.messageText = '';
      }
      if (file_url != '') {
        const chatRoomCollection = collection(
          this.firestore,
          `chatRooms`,
          this.parentData.roomCode,
          'messages'
        );
        const docRef = await addDoc(chatRoomCollection, {
          text: this.messageText,
          file_url: file_url,
          isRead: false,
          mediaUrl: '',
          message: '',
          receiverId: '',
          receiverName: '',
          receiverPhotoUrl: '',
          senderId: this.currentUser.uid,
          senderIsAstrologer: false,
          senderName: this.currentUser?.firstName,
          senderPhotoUrl: this.currentUser?.profilePicUrl
            ? this.currentUser?.profilePicUrl
            : '',
          time: new Date(),
          type: type,
        });
        this.messageText = '';
      }
    } catch (error) {
      console.log('this is error :', error);
    }
  }
  async sendImageMessage() {
    const inputElement = this.fileInput.nativeElement;
    const selectedFile = inputElement.files[0];

    if (selectedFile) {
      const storageRef = ref(
        this.storage,
        `/messages/data/webapp/user/` +
          `${this.authService?.activeUserValue?.uid}/` +
          selectedFile.name
      );
      const task = uploadBytesResumable(storageRef, selectedFile);

      task.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // this.uploadProgress = progress;
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          console.log('this is an error while uploading file');
        },
        () => {
          getDownloadURL(storageRef).then((data) => {
            if (this.sendMessage('image_text', data)) {
              this.confirmationOverlay = false;
              this.sendImageInMessage = false;
            }
          });
        }
      );
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
      this.confirmationOverlay = true;
      this.sendImageInMessage = true;
    }
  }

  downloadFileFromChat(fileData) {
    this.imagePreview = fileData?.file_url;
    this.confirmationOverlay = true;
    this.sendImageInMessage = true;
    this.downloadFile = true;
  }
  closeOverlay() {
    this.confirmationOverlay = false;
    this.sendImageInMessage = false;
    this.downloadFile = false;
    this.messageText = '';
    this.openUserData = false;
  }
  async seeUserDetails() {
    const Data = await this.userService.getDataFromUserCollection(
      this.parentData.notificationData?.senderId
    );
    if (Data) {
      this.confirmationOverlay = true;
      this.relations = Data;
      this.openUserData = true;
    }
  }
}
