import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, UserService } from 'src/app/core/services';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent implements OnInit {
  MAPPED_DASHBOARD = {
    foreign_settlement: {
      key: 'Foreign Settlement',
      logo: '../../../assets/images/dashboard/Foreign_Settlement_new.png',
    },
    remedies: {
      key: 'Remedies',
      logo: '../../../assets/images/dashboard/Remedies_new.png',
    },
    job_vs_business: {
      key: 'Job VS Business',
      logo: '../../../assets/images/dashboard/Job_VS_Business_new.png',
    },
    love: {
      key: 'Love',
      logo: '../../../assets/images/dashboard/Love_new.png',
    },
    horoscope_match: {
      key: 'Horoscope Match',
      logo: '../../../assets/images/dashboard/Horoscope_Match.png',
    },
    students: {
      key: 'Students',
      logo: '../../../assets/images/dashboard/Students_new.png',
    },
    improving_sex_life: {
      key: 'Improving Sex Life',
      logo: '../../../assets/images/dashboard/Improving_Sex_Life_new.png',
    },
    career_insights_problems: {
      key: 'Career Insights Problems',
      logo: '../../../assets/images/dashboard/career_insights.png',
    },
    who_am_i: {
      key: 'Who Am I',
      logo: '../../../assets/images/dashboard/who_am_i_new.png',
    },
    muhurta_auspicious: {
      key: 'Muhurtha',
      logo: '../../../assets/images/dashboard/Muhurtha_new.png',
    },
    panchanga: {
      key: 'Today’s Panchanga',
      logo: '../../../assets/images/dashboard/Today_Panchanga_new.png',
    },
    today_prediction: {
      key: 'Today’s prediction',
      logo: '../../../assets/images/dashboard/Today’_prediction_new.png',
    },
    know_your_child: {
      key: 'Know your child',
      logo: '../../../assets/images/dashboard/Foreign_Settlement.png',
    },
    know_your_husband: {
      key: 'Know your husband',
      logo: '../../../assets/images/dashboard/Horoscope_Match.png',
    },
    know_your_wife: {
      key: 'Know your wife',
      logo: '../../../assets/images/dashboard/Family_Dynamics.png',
    },
    know_your_father: {
      key: 'Know your father',
      logo: '../../../assets/images/dashboard/Muhurtha.png',
    },
    know_your_mother: {
      key: 'Know your mother',
      logo: '../../../assets/images/dashboard/Today_Panchanga.png',
    },
    know_your_guardian: {
      key: 'Know your guardian',
      logo: '../../../assets/images/dashboard/perm_identity.png',
    },
    know_your_boss: {
      key: 'Know your boss',
      logo: '../../../assets/images/dashboard/lightbulb_outline.png',
    },
    know_your_colleague: {
      key: 'Know your colleague',
      logo: '../../../assets/images/dashboard/Today’_prediction.png',
    },
    know_your_friend: {
      key: 'Know your friend',
      logo: '../../../assets/images/dashboard/Remedies.png',
    },
    loshu_grid: {
      key: 'Loshu Grid',
      logo: '../../../assets/images/dashboard/Loshu_Grid_new.png',
    },
  };
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
          console.log('data', data?.docs);
          data.docs.forEach((doc) => {
            console.log(doc);
            let data1 = doc.data() as Object;
            console.log('data12345', data1);

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
          console.log('data', data?.docs);
          data.docs.forEach((doc) => {
            let data1 = doc.data() as Object;
            console.log('data1234567890', data1);

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
