import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  isSidebarVisible = true;
  stoppingPoint: number;
  constructor(
    public activateRoute: ActivatedRoute,
    public userService: UserService
  ) {}
  data;
  // data = {
  //   type: 'text',
  //   title: 'hellot hissis title cool',
  //   summary: 'cooolol',
  //   hero_image: '../../../assets/images/message.png',
  //   content:
  //     'In the boundless realm of artistic expression, astrology serves as a guiding star, illuminating the unique ways each zodiac sign ignites the creative spark withinEmbarking on a transformative odyssey, we delve into the enchanting world of astrology and creativity, unveiling how celestial energies inspire and shape your artistic endeavors.Explore how Aries individuals infuse their artistic pursuits with audaciousness and fearlessness, resulting in creations that reflect their dynamic energy.Discover how Leo individuals infuse their creative works with theatrical flair, basking in the spotlight and using their artistic endeavors to captivate and inspire.Scorpio zodiac : Intense Depth and Transformative Art“The Lunar Phases and Your Zodiac Sign: Harnessing Lunar Energies”As we conclude, delve into Scorpio’s intense depth and transformative art',
  //   sections: [
  //     {
  //       section_title: 'hello cool',
  //       section_image: '../../../assets/images/google.png',
  //       section_content:
  //         'In the boundless realm of artistic expression, astrology serves as a guiding star, illuminating the unique ways each zodiac sign ignites the creative spark withinEmbarking on a transformative odyssey, we delve into the enchanting world of astrology and creativity, unveiling how celestial energies inspire and shape your artistic endeavors.Explore how Aries individuals infuse their artistic pursuits with audaciousness and fearlessness, resulting in creations that reflect their dynamic energy.Discover how Leo individuals infuse their creative works with theatrical flair, basking in the spotlight and using their artistic endeavors to captivate and inspire.Scorpio zodiac : Intense Depth and Transformative Art“The Lunar Phases and Your Zodiac Sign: Harnessing Lunar Energies”As we conclude, delve into Scorpio’s intense depth and transformative art',
  //     },
  //     {
  //       section_title: 'hello nice',
  //       section_image: '../../../assets/images/google.png',
  //       section_content:
  //         'In the boundless realm of artistic expression, astrology serves as a guiding star, illuminating the unique ways each zodiac sign ignites the creative spark withinEmbarking on a transformative odyssey, we delve into the enchanting world of astrology and creativity, unveiling how celestial energies inspire and shape your artistic endeavors.Explore how Aries individuals infuse their artistic pursuits with audaciousness and fearlessness, resulting in creations that reflect their dynamic energy.Discover how Leo individuals infuse their creative works with theatrical flair, basking in the spotlight and using their artistic endeavors to captivate and inspire.Scorpio zodiac : Intense Depth and Transformative Art“The Lunar Phases and Your Zodiac Sign: Harnessing Lunar Energies”As we conclude, delve into Scorpio’s intense depth and transformative art',
  //     },
  //     {
  //       section_title: 'hello ok how are you',
  //       section_image: '../../../assets/images/google.png',
  //       section_content:
  //         'In the boundless realm of artistic expression, astrology serves as a guiding star, illuminating the unique ways each zodiac sign ignites the creative spark withinEmbarking on a transformative odyssey, we delve into the enchanting world of astrology and creativity, unveiling how celestial energies inspire and shape your artistic endeavors.Explore how Aries individuals infuse their artistic pursuits with audaciousness and fearlessness, resulting in creations that reflect their dynamic energy.Discover how Leo individuals infuse their creative works with theatrical flair, basking in the spotlight and using their artistic endeavors to captivate and inspire.Scorpio zodiac : Intense Depth and Transformative Art“The Lunar Phases and Your Zodiac Sign: Harnessing Lunar Energies”As we conclude, delve into Scorpio’s intense depth and transformative art',
  //     },
  //   ],
  //   author: 'cool',
  //   authored_on: '10/10/2023',
  // };
  ngOnInit() {
    this.activateRoute.params.subscribe((params) => {
      this.userService.getBlogDataFromSlug(params.slug).then((data) => {
        data.forEach((doc) => {
          let data = doc.data() as Object;
          this.data = data;
        });
      });
    });
  }

  @HostListener('window:scroll', [])
  onScroll() {
    this.checkScroll();
  }

  private checkScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;

    const blogEndElement = document.getElementById('blog-end');
    this.stoppingPoint = blogEndElement
      ? blogEndElement.offsetTop
      : Number.MAX_SAFE_INTEGER;
    if (scrollPosition + windowHeight >= this.stoppingPoint) {
      this.isSidebarVisible = false;
    } else {
      this.isSidebarVisible = true;
    }
  }

  scrollToSection(sectionId) {
    var section = document.getElementById('section-' + sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 100,
        behavior: 'smooth',
      });
    }
  }
}
