import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Astrologer } from 'src/app/core/models';
import { AstrologerService, UserService } from 'src/app/core/services';
import { AuthService } from 'src/app/core/services/auth.service';
import { CalluiComponent } from 'src/app/shared/callui/callui.component';
import { ChatuiComponent } from 'src/app/shared/chatui/chatui.component';
import { LoginComponent } from 'src/app/shared/login/login.component';
import { ProfileComponent } from 'src/app/shared/profile/profile.component';
import { WalletComponent } from 'src/app/shared/wallet/wallet.component';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss'],
})
export class BlogsComponent implements OnInit {
  specialtiesArray = [
    { name: 'Vedic', checked: false },
    { name: 'Numerology', checked: false },
    { name: 'Psychic', checked: false },
    { name: 'KP', checked: false },
    { name: 'Palmistry', checked: false },
    { name: 'Nadi', checked: false },
    { name: 'Vaastu', checked: false },
    { name: 'Psycology', checked: false },
    { name: 'Prashana', checked: false },
    { name: 'Face Reading', checked: false },
  ];
  genderArray = [
    { name: 'Male', checked: false, value: 'Male' },
    { name: 'Female', checked: false, value: 'Female' },
  ];
  yearsOfExperienceArray = [
    { name: '1 to 5 Years', checked: false, value: '1and5' },
    { name: '5 to 10 Years', checked: false, value: '5and10' },
    { name: 'Greater than 10 Years', checked: false, value: '10' },
  ];
  languagesArray = [
    { name: 'English', checked: false },
    { name: 'Hindi', checked: false },
  ];
  userData = null;
  toast = false;
  message = '';
  genderOption = '';
  yearOption = '';
  lastEntry = {};
  readMore = false;
  indexOf = null;
  blogData = null;
  scrolled = false;

  constructor(
    private modalService: NgbModal,
    public authService: AuthService,
    public astroServices: AstrologerService,
    public userService: UserService,
    public router: Router,
    private el: ElementRef
  ) {}

  public astrologersData = [];
  getAllblogs() {
    this.lastEntry = this.astrologersData.length
      ? this.astrologersData[this.astrologersData.length - 1]
      : {};
 
    this.userService.getAllBlogsData(this.lastEntry).then((data) => {

      if (!data?.empty) {
        data.forEach((doc) => {
          let data = doc.data() as Object;
          this.astrologersData = this.astrologersData.concat({
            id: doc?.id,
            ...data,
          });
        });
        this.scrolled = false;
      }
    });
  }
  ngOnInit(): void {
    this.getAllblogs();

    if (this.authService?.activeUserValue) {
      this.userService
        .getUserDataInfo(this.authService?.activeUserValue?.uid)
        .then((userVal) => {
          this.userData = userVal;
        });
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;

    const blogEndElement = document.getElementById('line-coool');
    if (scrollPosition + windowHeight >= blogEndElement.offsetTop) {
      if (!this.scrolled) {
        this.scrolled = true;
        this.getAllblogs();
      }
    }
  }

  readMoreText(index, type) {
    if (type == 'open') {
      this.indexOf = index;
      this.readMore = true;
    } else {
      this.indexOf = null;
      this.readMore = false;
    }
  }

  async specialtiesArrayChecked(e, index) {
    this.specialtiesArray[index]['checked'] = e.target.checked;
  }
  async languageArrayChecked(e, index) {
    this.languagesArray[index]['checked'] = e.target.checked;
  }
  async genderArrayChecked(e, optionValue) {
    this.genderOption = optionValue;
  }

  async yearsOfExperienceArrayChecked(e, optionValue) {
    this.yearOption = optionValue;
  }

  async applyFilter() {
    let filterSpecialties = this.specialtiesArray
      .filter((data) => data.checked)
      .map((data1) => data1.name);
    let filterLanguage = this.languagesArray
      .filter((data) => data.checked)
      .map((data1) => data1.name);

    let data = await this.astroServices.getAllAstrologersDataFilterApply({
      filterSpecialties,
      filterLanguage,
      yearOption: this.yearOption,
      genderOption: this.genderOption,
    });
    data.subscribe((data1) => {
      if (filterLanguage.length) {
        data1 = data1.filter((item) =>
          item.languages.some((lang) => filterLanguage.includes(lang))
        );
      }
      this.astrologersData = data1;
      this.modalService.dismissAll();
    });
  }
  async resetFilter() {
    this.genderArray = this.genderArray.map((data) => {
      data.checked = false;
      return data;
    });
    this.specialtiesArray = this.specialtiesArray.map((data) => {
      data.checked = false;
      return data;
    });
    this.languagesArray = this.languagesArray.map((data) => {
      data.checked = false;
      return data;
    });
    this.yearsOfExperienceArray = this.yearsOfExperienceArray.map((data) => {
      data.checked = false;
      return data;
    });
    this.yearOption = '';
    this.genderOption = '';

    let data = await this.astroServices.getAllAstrologersDataFilterApply({
      filterSpecialties: [],
      filterLanguage: [],
      yearOption: '',
      genderOption: '',
    });
    data.subscribe((data1) => {
      this.astrologersData = data1;
      this.modalService.dismissAll();
    });
  }

  public openFilter(content: any): void {
    if (this.authService.activeUserValue) {
      const modalRef = this.modalService
        .open(content, {
          backdrop: 'static',
          keyboard: false,
          centered: true,
          size: 'lg',
        })
        .result.then(
          (result) => {},
          (reason) => {}
        );
    } else {
      const modalRef = this.modalService.open(LoginComponent, {
        backdrop: 'static',
        keyboard: false,
        centered: true,
        size: 'lg',
        modalDialogClass: 'login',
      });
    }
  }

  resetToast() {
    this.toast = false;
  }

  openChatWindow() {
    if (this.authService.activeUserValue) {
      this.modalService.open(CalluiComponent, {
        backdrop: 'static',
        keyboard: false,
        centered: true,
        size: 'lg',
        scrollable: true,
      });
    } else {
      const modalRef = this.modalService.open(LoginComponent, {
        backdrop: 'static',
        keyboard: false,
        centered: true,
        size: 'lg',
        modalDialogClass: 'login',
      });
    }
  }
  openWallet() {
    this.modalService.dismissAll();
    // top up balance
    const modalRef = this.modalService.open(WalletComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
      scrollable: true,
    });
  }
  openConfirmation(content) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        backdrop: 'static',
        keyboard: false,
        centered: true,
        size: 'lg',
        scrollable: true,
      })
      .result.then();
  }
  sendChatNotificationToAstrologer(e: MouseEvent, astroData, content) {
    e.stopPropagation();
    this.router.navigate([`blogs/blog/${astroData?.slug}`]);
  }
}
