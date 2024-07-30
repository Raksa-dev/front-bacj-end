import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Testimonial, Astrologer } from 'src/app/core/models';
import { LoginComponent } from '../../shared/login/login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newlandingpage',
  templateUrl: './newlandingpage.component.html',
  styleUrls: ['./newlandingpage.component.scss'],
})
export class NewlandingpageComponent {
  constructor(private modalService: NgbModal, route: Router) {
    let userType = localStorage.getItem('userType');
    if (userType == 'user') {
      route.navigateByUrl('/dashboard');
    }
  }

  public guides: Testimonial[] = [
    {
      _id: 1,
      avatar: '../../../assets/images/self_aware.png',
      userName: 'Self Awareness',
      age: 30,
      address:
        "Unlock your inner potential with Raksa's self-awareness insights.",
      message: `I was amazed by the accuracy and depth of insights I received through Raksa. Chatting with the astrologer provided me with valuable guidance on my career and relationships.  Highly recommended!`,
    },
    {
      _id: 2,
      avatar: '../../../assets/images/monthly_wall_calendar.png',
      userName: 'Muhurtha - Auspicious Time',
      age: 28,
      address:
        "Discover auspicious moments with Raksa's precise muhurtha guidance.",
      message: `Raksa has been my go-to platform for astrology consultations. I connected with knowledgeable astrologers who provided profound interpretations of my birth chart. The convenience and expertise offered by Raksa have been invaluable in navigating life's challenges.`,
    },
    {
      _id: 3,
      avatar: '../../../assets/images/relationship.png',
      userName: 'Relationship Strength',
      age: 0,
      address:
        "Enhance your love life with Raksa's relationship strength insights.",
      message: `The live astrologers on Raksa have transformed my understanding of astrology. Their real-time guidance and accurate predictions have given me clarity and confidence in making important decisions. It has become an indispensable part of my spiritual journey.`,
    },
    {
      _id: 3,
      avatar: '../../../assets/images/vaadin_family.png',
      userName: 'Family Dynamics',
      age: 40,
      address: 'Understand and strengthen your family connections with Raksa.',
      message: `The live astrologers on Raksa have transformed my understanding of astrology. Their real-time guidance and accurate predictions have given me clarity and confidence in making important decisions. It has become an indispensable part of my spiritual journey.`,
    },
    {
      _id: 3,
      avatar: '../../../assets/images/love.png',
      userName: 'Love',
      age: 40,
      address: "Explore cosmic connections with Raksa's love insights.",
      message: `The live astrologers on Raksa have transformed my understanding of astrology. Their real-time guidance and accurate predictions have given me clarity and confidence in making important decisions. It has become an indispensable part of my spiritual journey.`,
    },
    {
      _id: 3,
      avatar: '../../../assets/images/h_j_c_b.png',
      userName: 'Health, Job, Career, Business',
      age: 40,
      address:
        "Achieve success in career, health, and business with Raksa's guidance.",
      message: `The live astrologers on Raksa have transformed my understanding of astrology. Their real-time guidance and accurate predictions have given me clarity and confidence in making important decisions. It has become an indispensable part of my spiritual journey.`,
    },
  ];

  public whyRaksa: Testimonial[] = [
    {
      _id: 1,
      avatar: '../../../assets/images/testimonial/avatar-1.png',
      userName: 'Guided Accuracy',
      age: 30,
      address:
        'We ensure the accuracy and reliability of our horoscope readings to guide you through life’s challenges and opportunities.',
      message: `I was amazed by the accuracy and depth of insights I received through Raksa. Chatting with the astrologer provided me with valuable guidance on my career and relationships.  Highly recommended!`,
    },
    {
      _id: 2,
      avatar: '../../../assets/images/testimonial/avatar-2.png',
      userName: 'Affordable Pricing',
      age: 28,
      address:
        'Enjoy high-quality, comprehensive astrology readings at a fraction of the cost',
      message: `Raksa has been my go-to platform for astrology consultations. I connected with knowledgeable astrologers who provided profound interpretations of my birth chart. The convenience and expertise offered by Raksa have been invaluable in navigating life's challenges.`,
    },
    {
      _id: 3,
      avatar: '../../../assets/images/testimonial/avatar-3.png',
      userName: 'Life Insights',
      age: 40,
      address:
        'Receive detailed insights into all spects of your life, from career and health to relationships and finances.',
      message: `The live astrologers on Raksa have transformed my understanding of astrology. Their real-time guidance and accurate predictions have given me clarity and confidence in making important decisions. It has become an indispensable part of my spiritual journey.`,
    },
    {
      _id: 3,
      avatar: '../../../assets/images/testimonial/avatar-3.png',
      userName: 'All-Inclusive Question Coverage',
      age: 40,
      address:
        'Receive detailed insights into all spects of your life, from career and health to relationships and finances.',
      message: `The live astrologers on Raksa have transformed my understanding of astrology. Their real-time guidance and accurate predictions have given me clarity and confidence in making important decisions. It has become an indispensable part of my spiritual journey.`,
    },
    {
      _id: 3,
      avatar: '../../../assets/images/testimonial/avatar-3.png',
      userName: 'Your Cosmic Guide',
      age: 40,
      address:
        'Receive detailed insights into all spects of your life, from career and health to relationships and finances.',
      message: `The live astrologers on Raksa have transformed my understanding of astrology. Their real-time guidance and accurate predictions have given me clarity and confidence in making important decisions. It has become an indispensable part of my spiritual journey.`,
    },
    {
      _id: 3,
      avatar: '../../../assets/images/testimonial/avatar-3.png',
      userName: 'X - eXpansive Readings',
      age: 40,
      address:
        'Receive detailed insights into all spects of your life, from career and health to relationships and finances.',
      message: `The live astrologers on Raksa have transformed my understanding of astrology. Their real-time guidance and accurate predictions have given me clarity and confidence in making important decisions. It has become an indispensable part of my spiritual journey.`,
    },
  ];
  public testimonials: Testimonial[] = [
    {
      _id: 1,
      userName: 'Tanay',
      age: 30,
      avatar: '../../../assets/images/testimonial/avatar-3.png',
      address: ' Assam, India',
      message: `Raksa's platform is user-friendly and the predesigned questions cover everything I need to know about my life. The insights are spot-on and have given me a clear direction in both my personal and professional life. Simply outstanding!`,
    },
    {
      _id: 2,
      avatar: '../../../assets/images/testimonial/avatar-2.png',
      userName: 'Riya',
      age: 28,
      address: 'Uttar Pradesh, India',
      message: `Raksa has been my go-to platform for astrology consultations. I connected with knowledgeable astrologers who provided profound interpretations of my birth chart. The convenience and expertise offered by Raksa have been invaluable in navigating life's challenges.`,
    },
    {
      _id: 3,
      avatar: '../../../assets/images/testimonial/avatar-1.png',
      userName: 'Kim',
      age: 40,
      address: 'Bangalore, India',
      message: `The comprehensive readings and the precise muhurtha guidance provided by Raksa have been a game changer for me. It's amazing how accurate and affordable this service is. A must-try for anyone seeking astrological guidance
`,
    },
  ];

  public heroImage = [
    {
      _id: 1,
      img: '../../../assets/images/hero-image-1.png',
      text: 'Answers to Life’s Most Important Questions',
    },
    {
      _id: 2,
      img: '../../../assets/images/hero-image-2.png',
      text: 'Answers to Life’s Most Important Questions',
    },
    {
      _id: 3,
      img: '../../../assets/images/hero-image-3.png',
      text: 'Answers to Life’s Most Important Questions',
    },
  ];

  onClick() {
    const modalRef = this.modalService.open(LoginComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
      modalDialogClass: 'login',
    });
  }

  public astrologers: Astrologer[] = [
    {
      _id: 1,
      avatar: '../../../assets/images/featured/avatar-1.png',
      astrologerName: 'Sanjay',
      experience: 'Vedik Astrology',
      tags: 'English, Hindi, Marathi',
      rating: 4.5,
      reviews: 1000,
      online: true,
    },
    {
      _id: 2,
      avatar: '../../../assets/images/featured/avatar-2.png',
      astrologerName: 'Samira',
      experience: 'Vedik Astrology',
      tags: 'English, Hindi, Marathi',
      rating: 4.5,
      reviews: 2500,
      online: false,
    },
    {
      _id: 3,
      avatar: '../../../assets/images/featured/avatar-3.png',
      astrologerName: 'Sanjay',
      experience: 'Vedik Astrology',
      tags: 'English, Hindi, Marathi',
      rating: 4.5,
      reviews: 1000,
      online: true,
    },
    {
      _id: 4,
      avatar: '../../../assets/images/featured/avatar-4.png',
      astrologerName: 'Rita',
      experience: 'Vedik Astrology',
      tags: 'English, Hindi, Marathi',
      rating: 4.5,
      reviews: 2500,
      online: true,
    },
    {
      _id: 5,
      avatar: '../../../assets/images/featured/avatar-5.png',
      astrologerName: 'Sanjay',
      experience: 'Vedik Astrology',
      tags: 'English, Hindi, Marathi',
      rating: 4.5,
      reviews: 1000,
      online: true,
    },
  ];

  public heroImageOwlOptions: OwlOptions = {
    items: 1,
    autoplay: true,
    loop: true,
    dots: true,
    margin: 150,
    stagePadding: 136,
    navText: ['', ''],
    autoWidth: true,
  };

  public testimonialOwlOptions: OwlOptions = {
    items: 3,
    autoplay: true,
    // rewind: true,
    loop: true,
    center: true,
    dots: true,
    autoWidth: true,
    nav: true,
    navText: ['', ''],
    margin: 36,
    stagePadding: 136,

    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      1200: {
        items: 3,
      },
    },
  };
}
