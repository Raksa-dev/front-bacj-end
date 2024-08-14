import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
const CryptoJS = require('crypto-js');

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
  razorPay;

  constructor(
    public authService: AuthService,
    public userService: UserService,
    public windowRefService: WindowRefService,
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder
  ) {
    this.razorPay = window['Razorpay'];
  }
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

  encryptForRazorPay(userId, amount) {
    var ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify({ userId, amount }),
      'Astro'
    ).toString();
    return ciphertext;
  }
  async openPayment(type, ciphertext?) {
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

    if (type == 'razorpay') {
      await (
        await this.userService.GetRazorPayOrderId(
          this.amountWithGstAddition * 100
        )
      ).subscribe((data) => {
        var options = {
          key: 'rzp_live_gOs6JLaCdCJhJv', // Enter the Key ID generated from the Dashboard
          amount: this.amountWithGstAddition * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: 'INR',
          name: 'Raksa', //your business name
          description: 'Test Transaction',
          image:
            'https://firebasestorage.googleapis.com/v0/b/raksa-1e906.appspot.com/o/Raksa%20Logo.png?alt=media&token=0a691c2e-cffc-42b7-a50a-6f980152b3c6',
          order_id: data['id'], //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          handler: function (response) {
            window.location.replace(
              `/transaction?type=success&val=${ciphertext}&orderId=${response.razorpay_order_id}`
            );
          },
          prefill: {
            //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
            name: this.currentUser?.firstName || 'random user name', //your customer's name
            email: this.currentUser?.email || 'randome@abc.com',
            contact: this.authService.activeUserValue?.phoneNumber, //Provide the customer's phone number for better conversion rates
          },
          notes: {
            address: 'Razorpay Corporate Office',
          },
          theme: {
            color: '#3399cc',
          },
        };
        var rzp1 = new this.razorPay(options);

        rzp1.on('payment.failed', function (response) {
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });

        rzp1.open();
      });
    }
  }

  refreshScreen() {
    this.userService.fetchUserData(this.authService.activeUserValue?.uid);
    this.activeModal.close({ response: false });
  }
  onCancel(): void {
    this.activeModal.close({ response: false });
  }
}
