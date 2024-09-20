import { Component } from '@angular/core';

import { USER_DASHBOARD } from '../../constants/userconstants';
import { Router } from '@angular/router';
import confetti from 'canvas-confetti';
import { OwlOptions } from 'ngx-owl-carousel-o';

import { UserService, AuthService } from 'src/app/core/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(
    public router: Router,
    public userService: UserService,
    public authService: AuthService
  ) {
    if (localStorage.getItem('userScreen') == 'true') {
      localStorage.removeItem('userScreen');
      localStorage.setItem('userType', 'user');
      if (localStorage.getItem('newuser') == 'true') {
        this.confitee = true;
        this.launchConfetti();
        localStorage.removeItem('newuser');
      } else {
        window.location.reload();
      }
    }
  }

  steps = 0;

  timeLeft: number = 5;
  countdownTimer: any;
  breathStatus: string = 'Breath In';

  goToDashBoard() {
    this.steps = 3;
  }

  startBreathingCycle() {
    setTimeout(() => {
      const totalDuration = 17; // 17 seconds total (4 in, 5 hold, 8 out)
      const breathInDuration = 4;
      const holdDuration = 5;
      const breathOutDuration = 8;

      let timePassed = 0;

      setInterval(() => {
        timePassed = (timePassed + 1) % totalDuration;

        if (timePassed < breathInDuration) {
          this.breathStatus = 'Breath In';
        } else if (timePassed < breathInDuration + holdDuration) {
          this.breathStatus = 'Hold';
        } else {
          this.breathStatus = 'Breath Out';
        }
      }, 1000); // Update status every second
    }, 0);
  }

  isTimeLeft() {
    return this.timeLeft >= 0;
  }

  runTimer() {
    this.steps = 1;

    setTimeout(() => {
      const timerElement = document.querySelector('.timer') as HTMLElement;
      const timerCircle = timerElement.querySelector(
        'svg > circle + circle'
      ) as HTMLElement;
      timerElement.classList.add('animatable');
      timerCircle.style.strokeDashoffset = '1';

      this.countdownTimer = setInterval(() => {
        if (this.isTimeLeft()) {
          const timeRemaining = this.timeLeft--;
          if (this.timeLeft <= 0) {
            this.timeLeft = 0;
            this.steps = 2;
            this.startBreathingCycle();
            clearInterval(this.countdownTimer);
            timerElement.classList.remove('animatable');
          }
          const normalizedTime = (5 - timeRemaining) / 5;
          timerCircle.style.strokeDashoffset = normalizedTime.toString();
        } else {
          clearInterval(this.countdownTimer);
          timerElement.classList.remove('animatable');
        }
      }, 1000);
    }, 0);
  }

  launchConfetti(): void {
    confetti({
      particleCount: 1000,
      spread: 360,
      origin: { x: 0.5, y: 0.5 },
    });
  }
  public section: any = USER_DASHBOARD.main;
  public selectedCategory = null;

  tooltipVisible = null;
  confitee = false;
  // tooltipX = '0px';
  // tooltipY = '0px';

  showTooltip(event: MouseEvent, menu) {
    this.tooltipVisible = menu;
    // this.tooltipX = event.clientX + 10 + 'px';
    // this.tooltipY = event.clientY + 10 + 'px';
  }
  hideConfitee() {
    this.confitee = false;
    window.location.reload();
  }
  hideTooltip() {
    this.tooltipVisible = null;
  }

  selectedCategoryClick(cat) {
    let list = [
      'Foreign Settlement',
      'Remedies',
      'Job VS Business',
      'Love',
      'Students',
      'Improving Sex Life',
      'Career Insights Problems',
      'Who Am I',
      'Muhurtha',
      'Today’s Panchanga',
      'Today’s prediction',
      'Horoscope Match',
      'Loshu Grid',
    ];
    this.userService.fetchUserData(this.authService.activeUserValue?.uid);
    if (list.includes(cat)) {
      this.router.navigate([`/book`], { queryParams: { cat } });
      return;
    }

    this.selectedCategory = cat;
    if (cat == 'Know') {
      this.section = USER_DASHBOARD['know'];
    }
  }

  selectCategory(cat: string): void {
    this.router.navigate([`/book`], { queryParams: { cat } });
  }

  public heroImage = [
    {
      _id: 1,
      img: '../../../assets/images/hero-image-1.png',
      text: '1. Relax for 1  min',
      para: [
        'Before you start reading the answers, take a few deep breaths.',
        'Try to relax your body and quiet your mind.',
        'Allow your thoughts to come and go for a while without holding on to them.',
      ],
    },

    {
      _id: 2,
      img: '../../../assets/images/hero-image-2.png',
      text: '2. Only The Question !',
      para: [
        'Focus for a moment or two on the question you would like to ask, or the issue you would like some information.',
        'The more effectively you can bring a relaxed focus to the issue at hand and clear other thoughts from your mind, the more insightful and helpful the reading will be.',
      ],
    },
    {
      _id: 3,
      img: '../../../assets/images/hero-image-3.png',
      text: '3. Maintain Your Focus',
      para: [
        'Absent mindedly clicking through the selection process will not bring good results.',
        'Focused attention helps to access the synchronicity necessary to gain maximum value from the reading.',
        'Make sure you take enough time to relax and compose yourself before you begin. You will be amazed at the difference it makes.',
      ],
    },
  ];

  public heroImageOwlOptions: OwlOptions = {
    items: 1,
    autoplay: true,
    loop: true,
    dots: false,
    margin: 150,
    stagePadding: 136,
    navText: ['', ''],
    autoWidth: true,
  };
}
