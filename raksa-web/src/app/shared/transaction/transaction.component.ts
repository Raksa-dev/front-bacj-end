import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, UserService } from 'src/app/core/services';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
  allTrasactions = [];
  constructor(
    public authService: AuthService,
    public userService: UserService,
    public activeModal: NgbActiveModal
  ) {}

  getAllTransaction() {
    this.userService
      .getAllTransactions(this.authService.activeUserValue?.uid)
      .then((data) => {
        data.docs.forEach((doc) => {
          let data1 = doc.data() as Object;
          this.allTrasactions.push(data1);
        });
      })
      .catch((err) => {
        console.log('erreo:', err);
      });
  }

  ngOnInit(): void {
    this.getAllTransaction();
  }
  onCancel(): void {
    this.activeModal.close({ response: false });
  }
}
