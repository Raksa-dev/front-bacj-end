import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, UserService } from 'src/app/core/services';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent implements OnInit {
  allTrasactions = [];
  isAstrologer;
  constructor(
    public authService: AuthService,
    public userService: UserService,
    public activeModal: NgbActiveModal
  ) {}

  getAllTransaction() {
    if (this.userService.getUserData?.isAstrologer) {
      this.isAstrologer = true;
      
      this.userService
        .getAllAstroSessions(this.authService.activeUserValue?.uid)
        .then((data) => {
          data.docs.forEach((doc) => {
            console.log(doc);
            let data1 = doc.data() as Object;
            this.allTrasactions.push(data1);
          });
        })
        .catch((err) => {
          console.log('error:', err);
        });
    } else {
      this.isAstrologer = false;

      this.userService
        .getAllSessions(this.authService.activeUserValue?.uid)
        .then((data) => {
          data.docs.forEach((doc) => {
            let data1 = doc.data() as Object;
            this.allTrasactions.push(data1);
          });
        })
        .catch((err) => {
          console.log('error:', err);
        });
    }
  }

  ngOnInit(): void {
    this.getAllTransaction();
  }
  onCancel(): void {
    this.activeModal.close({ response: false });
  }
}
