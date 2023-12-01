import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/core/services';
import { AstrologerService } from 'src/app/core/services/astrologer.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginComponent } from 'src/app/shared/login/login.component';
import { WalletComponent } from 'src/app/shared/wallet/wallet.component';

@Component({
  selector: 'app-chat-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutAstrolgerComponent implements OnInit {
  astrologer;
  showImage = false;
  readMore = false;
  partnerForm = false;

  userData = null;
  toast = false;
  message = '';
  modalType = '';
  allReviews = [];

  constructor(
    public authService: AuthService,
    public astroServices: AstrologerService,
    public router: Router,
    public userService: UserService,
    private modalService: NgbModal,
    public formBuilder: FormBuilder
  ) {}

  public relativeForm: FormGroup = this.formBuilder.group({
    relation: [null, [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    gender: [null, [Validators.required]],
    dateOfBirth: [null, [Validators.required]],
    birthTime: [null, [Validators.required]],
    birthPlace: ['', [Validators.required]],
    maritialStatus: [null, [Validators.required]],
    partnerDetailsCheckBox: [null],
    partnerName: [null],
    partnerGender: [null],
    partnerDateOfBirth: [null],
    partnerTimeOfBirth: [null],
    partnerPlaceOfBirth: [null],
  });
  ngOnInit(): void {
    this.astrologer = this.astroServices.getAstrologerBriefDataStore;
    if (!this.astrologer) {
      this.router.navigate(['/chat']);
    }
    if (this.astrologer && this.astrologer?.profilePicUrl) {
      this.showImage = true;
    }
    this.userService
      .getUserDataInfo(this.authService.activeUserValue.uid)
      .then((userVal) => {
        this.userData = userVal;
      });
    this.getAllReviewsForAstroUser();
  }

  getAllReviewsForAstroUser() {
    this.astroServices.allReview(this.astrologer?.uid).then((data) => {
      data?.subscribe((data1) => {
        console.log('all reviews in chat::', data1);
        this.allReviews = data1;
      });
    });
  }

  readMoreText() {
    this.readMore = !this.readMore;
  }

  selectedStars = 0.5;
  maxStars = 5;

  getStarColor(index: number): string {
    if (this.astrologer?.overallRating) {
      return index < this.selectedStars ? 'white' : 'gold'; // Change this to the desired colors
    }
    return 'white';
  }
  getProgressBarGradient(barNumber) {
    return `linear-gradient(90deg, #4CAF50 ${
      this.astrologer['ratings']
        ? (this.astrologer['ratings'][barNumber] /
            this.astrologer.totalReview) *
          100
        : 0
    }%, transparent ${
      this.astrologer['ratings']
        ? (this.astrologer['ratings'][barNumber] /
            this.astrologer.totalReview) *
          100
        : 0
    }%)`;
  }

  sendChatNotificationToAstrologer(content) {
    if (this.authService.activeUserValue) {
      let checkBalance = this.astrologer['chatChargePerMinute'] * 5;
      if (this.userData.walletBalance > checkBalance) {
        this.modalType = 'chat_form';
        this.openConfirmation(content);
      } else {
        this.modalType = 'wallet_form';
        this.message = `Minimum balance of 5 minutes (${checkBalance} INR) is required to start chat.`;
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

  sendCallNotificationToAstrologer(content) {
    if (this.authService.activeUserValue) {
      let checkBalance = this.astrologer['chatChargePerMinute'] * 5;

      if (this.userData.walletBalance > checkBalance) {
        this.userService
          .NotifyAstrologerForChat(
            this.astrologer,
            this.userService.getUserData,
            'call'
          )
          .then((data) => {
            this.toast = true;
            this.message = data?.message;
          });
      } else {
        this.modalType = 'wallet_form';
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

  resetToast() {
    this.toast = false;
  }

  cancelModal() {
    this.relativeForm.reset();
    this.modalService.dismissAll();
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
        // scrollable: true,
        // fullscreen: true,
      })
      .result.then((data) => {
        this.modalService.dismissAll();
      });
  }

  onCheckboxChange(event: Event): void {
    // Access the checked property directly
    const isChecked = (event.target as HTMLInputElement).checked;
    this.partnerForm = isChecked;
  }
  getFormattedString(data): string {
    // Split the string into words
    const words = data.split(/(?=[A-Z])/);

    // Capitalize the first letter of each word and join them back
    const formattedString = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return formattedString;
  }
  submitRelativeForm() {
    const formData = this.relativeForm.value;
    let sorted = {};
    Object.keys(formData).forEach((data) => {
      if (formData[data] && typeof formData[data] != 'object') {
        sorted[this.getFormattedString(data)] = formData[data];
      }
      if (
        formData[data] &&
        typeof formData[data] == 'object' &&
        data.includes('Time')
      ) {
        const hour = formData[data]?.hour?.toString().padStart(2, '0');
        const minute = formData[data]?.minute?.toString().padStart(2, '0');
        const second = formData[data]?.second?.toString().padStart(2, '0');
        const formattedTime = `${hour}:${minute}:${second} ${
          formData[data]?.hour >= 12 ? 'PM' : 'AM'
        }`;

        sorted[this.getFormattedString(data)] = formattedTime;
      }
      if (
        formData[data] &&
        typeof formData[data] == 'object' &&
        data.toLocaleLowerCase().includes('date')
      ) {
        let date = new Date(
          formData[data].year,
          formData[data].month - 1,
          formData[data].day
        );

        sorted[this.getFormattedString(data)] = date.toDateString();
      }
    });
    let strings = '';
    Object.keys(sorted).forEach((data) => {
      strings += data + ': ' + sorted[data] + '/ ';
    });
    this.userService
      .NotifyAstrologerForChat(
        this.astrologer,
        this.userService.getUserData,
        'chat',
        strings
      )
      .then((data) => {
        this.toast = true;
        this.message = data?.message;
        this.relativeForm.reset();
        this.modalService.dismissAll();
      });
  }
}
