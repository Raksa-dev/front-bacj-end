import { Component, OnInit } from '@angular/core';

import { USER_DASHBOARD, TAROT } from '../../constants/userconstants';
import { Router } from '@angular/router';
import confetti from 'canvas-confetti';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService, AuthService } from 'src/app/core/services';

import { driver, Config, DriveStep } from 'driver.js';

@Component({
  selector: 'app-userlandingpage',
  templateUrl: './userlandingpage.component.html',
  styleUrls: ['./userlandingpage.component.scss'],
})
export class UserlandingpageComponent {
  confitee = false;

  constructor(
    public router: Router,
    public userService: UserService,
    public authService: AuthService,
    private modalService: NgbModal
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
  steps1: DriveStep[] = [
    {
      element: '#highlighted', // Targeting the text by its ID
      popover: {
        title: 'Welcome Aboard! 🎉',
        description:
          'This tour will guide you through the key features and functionalities we offer, ensuring you have a smooth and successful start.',
        side: 'bottom',
        align: 'center',
        showButtons: ['next', 'close'],
        popoverClass: 'custom-popover-class', // Custom class applied here
        doneBtnText: 'done button',
        nextBtnText: 'Give me a walkthrough',
      },
    },
    {
      element: '#highlighted-text', // Targeting the text by its ID
      popover: {
        title: 'Hello!!',
        description: 'You are entering sacred space!',
        side: 'bottom',
        align: 'center',
        showButtons: ['next', 'close'],
        popoverClass: 'custom-popover-class', // Custom class applied here
      },
    },
    {
      element: '#breath-button', // Targeting the text by its ID
      popover: {
        title: 'Go To Dashboard',
        description: 'Your Answers Are Here',
        side: 'bottom',
        align: 'center',
        showButtons: ['next', 'close'],
        popoverClass: 'custom-popover-class', // Custom class applied here
      },
    },
    {
      element: 'hello', // Targeting the text by its ID
      popover: {
        title: 'Breathe',
        description:
          'Discover the power of breath, relaxation, and focus with Raksa! The deeper you breathe, the more centered you become, and the clearer the insights will be. Astrology is a sacred art, guiding us through the cosmic dance of life.',
        side: 'bottom',
        align: 'center',
        showButtons: ['next'],
        popoverClass: 'custom-popover-class-breath', // Custom class applied here
      },
    },
    {
      element: 'hello', // Targeting the text by its ID
      popover: {
        title: 'Thank You',
        description: 'Enjoy!!',
        side: 'bottom',
        align: 'center',
        showButtons: ['next', 'close'],
        popoverClass: 'custom-popover-class', // Custom class applied here
        onNextClick: () => {
          window.location.reload();
        },
      },
    },

    // Add more steps as needed
  ];

  steps = 0;

  timeLeft: number = 5;
  countdownTimer: any;
  breathStatus: string = 'Breath In';

  tourDriver;
  startTour() {
    const config: Config = {
      steps: this.steps1,
      animate: true,
      overlayOpacity: 0.75,
      allowClose: true,
      stagePadding: 10,
      stageRadius: 5,
      doneBtnText: 'Finish',
      nextBtnText: 'Next',
      prevBtnText: 'Previous',
    };

    this.tourDriver = driver(config);
    this.tourDriver.drive(); // Start the tour
  }

  goToDashBoard() {
    // this.tourDriver.destroy();
    this.steps = 3;
    clearTimeout(this.breathCyle);
    this.modalService.dismissAll();
    this.router.navigateByUrl('/');
  }
  hideConfitee() {
    this.confitee = false;
    this.startTour();
  }
  breathCyle;
  startBreathingCycle() {
    this.breathCyle = setTimeout(() => {
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

  runTimer(breath) {
    this.steps = 1;
    this.modalService
      .open(breath, {
        ariaLabelledBy: 'modal-basic-title',
        backdrop: 'static',
        keyboard: false,
        centered: true,
        // size: 'lg',
        scrollable: true,
      })
      .result.then((data) => {})
      .catch((err) => {
        console.log(err);
      });

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
    }, 10);
  }

  launchConfetti(): void {
    confetti({
      particleCount: 1000,
      spread: 360,
      origin: { x: 0.5, y: 0.5 },
    });
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
    smartSpeed: 3000,
    autoplayTimeout: 15000, // Time between each slide change (3000ms = 3 seconds)
    autoplayHoverPause: true,
  };
}
