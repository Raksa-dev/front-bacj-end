import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Auth } from 'firebase/auth';
import {
  AuthService,
  UserService,
  WindowRefService,
} from 'src/app/core/services';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  showPaymentOverlay: boolean = false;
  amountWithGstAddition = 0;
  constructor(
    public authService: AuthService,
    public userService: UserService,
    public windowRefService: WindowRefService,
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder
  ) {}
  public addMoneyForm: FormGroup = this.formBuilder.group({
    amount: [null, [Validators.required]],
  });
  public currentUser = this.userService.getUserData;

  ngOnInit(): void {}
  async submitAmountDetailsForm() {
    this.addMoneyForm.value.amount + 18;
    this.amountWithGstAddition =
      this.addMoneyForm.value.amount +
      this.addMoneyForm.value.amount * (18 / 100);
    this.showPaymentOverlay = true;
  }
  closeOverlay() {
    this.showPaymentOverlay = false;
  }
  setAmount(amount) {
    this.addMoneyForm.setValue({ amount });
  }
  async openPayment(type) {
    const formValues = this.addMoneyForm.value;
    if (type == 'phonePay') {
      (
        await this.userService.GetPhonePayPaymentForm(
          this.amountWithGstAddition,
          this.authService.activeUserValue['uid']
        )
      ).subscribe((data) => {
        this.amountWithGstAddition = 0;
        this.showPaymentOverlay = false;
        window.open(data['data'].instrumentResponse.redirectInfo.url, '_blank');
      });
    }

    if (type == 'ccAvenue') {
      (
        await this.userService.GetCcavenuePaymentForm(
          this.amountWithGstAddition,
          this.authService.activeUserValue['uid']
        )
      ).subscribe((data: string) => {
        this.amountWithGstAddition = 0;
        this.showPaymentOverlay = false;
        let child = window.open('about:blank', 'myChild');
        child.document.write(data);
        child.document.close();
      });
    }
  }

  refreshScreen() {
    this.userService.fetchUserData(this.currentUser['uid']);
    this.activeModal.close({ response: false });
  }
  onCancel(): void {
    this.activeModal.close({ response: false });
  }
}
