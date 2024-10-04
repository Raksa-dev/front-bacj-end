import { Component, OnInit } from '@angular/core';

import { USER_DASHBOARD, TAROT } from '../../constants/userconstants';
import { Router } from '@angular/router';
import confetti from 'canvas-confetti';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService, AuthService } from 'src/app/core/services';

import { driver, Config, DriveStep } from 'driver.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  shuffledCards: number[] = [];
  shuffleCards() {
    this.shuffledCards = this.cards.sort(() => Math.random() - 0.5); // Shuffle cards randomly
  }
  getRandomLeftPosition(): string {
    // Assuming there are 22 cards, adjust this based on the actual positions needed
    return `${Math.floor(Math.random() * 22) * 50}px`; // Random left position
  }
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
  public section: any = USER_DASHBOARD.main;
  public selectedCategory = null;

  tooltipVisible = null;
  confitee = false;

  showTooltip(event: MouseEvent, menu) {
    this.tooltipVisible = menu;
  }
  hideConfitee() {
    this.confitee = false;
    this.startTour();
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
    smartSpeed: 3000,
    autoplayTimeout: 15000, // Time between each slide change (3000ms = 3 seconds)
    autoplayHoverPause: true,
  };

  cards = Array(22).fill({ lifted: false }); // Adjust the number of cards as needed.
  isSpread = false; // A flag to determine the current state (stacked or spread).

  // Stack function: Resets the classes to just 'card' with a delay.
  stackCards() {
    this.isSpread = false;
    this.liftedCard = [];
    this.cards.forEach((_, i) => {
      setTimeout(() => {
        // No extra class added when stacked (i.e., no aniX class)
        this.cards[i] = 0;
      }, i * 150);
    });
  }

  getCardNew() {
    this.cards.forEach((_, i) => {
      setTimeout(() => {
        // Adds class 'aniX' for each card
        this.cards[i] = i;
        return `card-1 ani${i}`;
      }, i * 150);
    });
  }
  CARDS = [
    'The Fool',
    'The Magician',
    'The High Priestess',
    'The Empress',
    'The Emperor',
    'The Hierophant',
    'The Lovers',
    'The Chariot',
    'Strength',
    'The Hermit',
    'The Wheel of Fortune',
    'Justice',
    'The Hanged Man',
    'Death',
    'Temperance',
    'The Devil',
    'The Tower',
    'The Star',
    'The Moon',
    'The Sun',
    'Judgement',
    'The World',
  ];

  spreadCards() {
    this.isSpread = true;
  }

  getCardClass(index: number) {
    return 'card-1';
  }

  getRandomUniqueItems(arr, numItems) {
    const result = [];
    const tempArr = [...arr]; // Create a copy of the original array

    while (result.length < numItems && tempArr.length > 0) {
      // Get a random index
      const randomIndex = Math.floor(Math.random() * tempArr.length);

      // Remove the item from tempArr and add it to the result
      result.push(tempArr.splice(randomIndex, 1)[0]);
    }

    return result;
  }

  randomCardData = [];

  questions = [
    `Card 1:  How you feel about yourself`,
    `Card 2:  What you want most right now`,
    `Card 3:  Your fears`,
    `Card 4:  What is going for you`,
    `Card 5:  What is going against you`,
    `Card 6:  The likely outcome`,
  ];

  seletecCards(arr) {
    arr.map((data, i) => {
      this.randomCardData.push({
        cardName: data,
        image: TAROT[data]?.image,
        des: TAROT[data][(i + 1).toString()],
        cardTitle: this.questions[i],
      });
    });
  }

  liftedCard = [];
  liftCard(index) {
    if (this.liftedCard.length == 6) {
      let a = this.getRandomUniqueItems(this.CARDS, 6);
      this.seletecCards(a);
      return;
    }
    this.cards[index] = { lifted: true };
    this.liftedCard.push(index);
  }
}
