import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  layer1_male_ascendants,
  layer1_female_ascendants,
} from 'src/app/constants/layer1';

import { HttpClient } from '@angular/common/http';

import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';

import { AuthService, UserService } from 'src/app/core/services';

// import { WindowRefService } from 'src/app/core/services';

import { Observable, Subject, of, throwError } from 'rxjs';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { WalletComponent } from 'src/app/shared/wallet/wallet.component';
import { QUESTIONS } from 'src/app/constants/questions';
import { CATEGORICALMAPPING } from 'src/app/constants/userconstants';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent implements OnInit {
  selectedCategory: string;
  checkboxForm: FormGroup;
  public categoricalQuestion = QUESTIONS;

  layer2Question = [
    {
      response:
        'This individual with a Gemini Ascendant is likely to be intellectually sharp, curious, and communicative. They have a quick wit and are adaptable in social situations. With the ruler of Gemini, Mercury, being in Taurus, they may have a stable and grounded approach to communication and thinking.\n\nWith Mars aspecting the Ascendant, they may have an assertive and energetic personality, giving them the drive to pursue their goals with determination. They may also have a competitive streak and enjoy taking on challenges.\n\nTheir Sun in Taurus indicates a practical and grounded approach to life, valuing stability, security, and material comforts. They are likely to have a strong sense of self-worth and may possess a dependable and reliable nature.\n\nHaving a Moon in Pisces suggests that they are sensitive, empathetic, and imaginative. They may have a strong intuition and deep emotional sensitivity, being in touch with their own emotions as well as the feelings of others.\n\nWith Mars, Moon, and Rahu in Pisces, they may have a creative and dreamy side to their personality, as well as a compassionate and humanitarian outlook.\n\nOverall, this individual is likely to be a versatile and dynamic individual who is able to adapt to different situations with ease, while also maintaining a strong sense of self and values. Their intellectual curiosity and communicative skills, combined with their practical and grounded approach, make them a well-rounded and engaging personality.',
      ascendant: 'Gemini',
      time: '07:00:00',
    },
    {
      response:
        "This individual with a Cancer Ascendant, also known as a Cancer Rising, embodies the nurturing and caring qualities of their Ascendant sign. They are likely to be sensitive, empathetic, and protective of those they love. With their Ascendant ruler, the Moon, in Pisces, there is a deep emotional intensity and dreamy nature to their persona.\n\nAlthough there are no planets in the Ascendant, the presence of Rahu aspecting the Ascendant adds an unpredictable and unconventional energy to their personality. Rahu can bring both challenges and opportunities for growth in the individual's life.\n\nWith the Sun in Taurus, they have a grounded and practical approach to life, valuing stability and security. Their Moon in Pisces enhances their emotional depth and imagination, making them highly intuitive and empathetic towards others.\n\nThe positions of other planets also play a significant role in shaping this individual's character. With Mars, Mercury, Jupiter, and Venus all in Taurus, they possess a strong sense of determination, intellectual curiosity, expansive outlook, and appreciation for beauty and harmony. Saturn in Aquarius emphasizes their humanitarian and innovative side, while Rahu in Pisces adds a mystical and spiritual touch to their personality. Ketu in Virgo may bring a sense of detachment and analytical skills to the mix.\n\nOverall, this person's astrological chart suggests a compassionate, creative, and emotionally complex individual who may excel in roles that involve caregiving, artistic pursuits, or spiritual exploration. They may struggle with setting firm boundaries and need to work on balancing their emotions with practicality in their everyday life.",
      ascendant: 'Cancer',
      time: '09:00:00',
    },
    {
      response:
        "This individual with a Leo Ascendant, also known as their rising sign, projects confidence, charisma, and a strong sense of leadership. They embody the traits of a natural born leader, with a regal and magnetic presence that draws others towards them. With the Ascendant ruler being the Sun, they radiate a warm and radiant energy that lights up any room they enter.\n\nAlthough there are no planets in the Ascendant, Saturn's aspect on the Ascendant brings a sense of discipline, responsibility, and structure to their persona. They are likely to approach life with a sense of maturity and practicality, balancing out their fiery Leo energy with a grounded perspective.\n\nWith the Sun in Taurus, this person values stability, security, and luxury. They are likely to have a strong fixed nature, being determined and persistent in achieving their goals. Their Taurus Sun also adds a touch of sensuality, pleasure, and appreciation for the finer things in life.\n\nThe Moon in Pisces enhances their empathetic, intuitive, and imaginative side. They are deeply in tune with their emotions and the emotions of others, often showing compassion and understanding towards those in need. This placement also brings out their artistic and creative talents, making them naturally attuned to the arts.\n\nWith a Mars in Pisces, they may have a passive-aggressive or indirect approach towards asserting themselves. Mercury in Taurus suggests a practical and down-to-earth communication style, while Jupiter in Taurus amplifies their sense of abundance, growth, and expansion in material matters.\n\nVenus in Taurus indicates a love for beauty, harmony, and sensuality in relationships. They are likely to be devoted and loyal partners, valuing loyalty and commitment in love. Saturn in Aquarius suggests a disciplined and structured approach towards their social connections, emphasizing the importance of building solid foundations in friendships.\n\nWith Rahu in Pisces and Ketu in Virgo, this individual may have a strong spiritual inclination and a desire to transcend material boundaries. They may also have issues related to perfectionism and self-criticism that they need to work through in this lifetime.\n\nOverall, this individual with a Leo Ascendant carries a unique blend of confident leadership, emotional depth, practicality, and sensuality. They are magnetic and inspiring, with the potential to excel in positions of influence and creativity.",
      ascendant: 'Leo',
      time: '11:00:00',
    },
  ];

  isHovered = false;

  showUsers() {
    this.isHovered = true;
  }

  hideUsers() {
    this.isHovered = false;
  }

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  public currentYear = new Date().getFullYear();

  public SearchCountryField = SearchCountryField;
  public CountryISO = CountryISO;
  public PhoneNumberFormat = PhoneNumberFormat;
  public preferredCountries: CountryISO[] = [
    CountryISO.India,
    CountryISO.UnitedStates,
  ];
  public currentUser = this.userService.getUserData;

  public questionSet = { category: '', index: 0 };
  public questionSelected = null;

  public question;
  public answerText = '';

  public selectedTimeIfYouKnow: {
    hour: number;
    minute: number;
    second: number;
  };

  public userList;

  getUserList() {
    let userList = localStorage.getItem('userList');
    this.userList = JSON.parse(userList);
  }
  populateForm(user) {
    if (user?.birthTime) {
      this.signUpForm.addControl(
        'birthTime',
        this.formBuilder.control(user['rawFormatbirthTime'], [
          Validators.required,
        ])
      );
      this.signUpForm.patchValue({
        firstName: user?.firstName,
        gender: user?.gender,
        dateOfBirth: user?.showDateOfBirth,
        birthPlace: user?.birthPlace,
        birthTime: user['rawFormatbirthTime'],
      });
    } else {
      this.signUpForm.patchValue({
        firstName: user?.firstName,
        gender: user?.gender,
        dateOfBirth: user?.showDateOfBirth,
        birthPlace: user?.birthPlace,
      });
    }
  }

  consultAstrologer() {
    this.route.navigate(['chat']);
  }
  youKnowYourTimeButton = false;
  onTimeSelected(time) {
    this.selectedTimeIfYouKnow = time;
  }
  onTimeSelectedClick() {
    const hour = this.selectedTimeIfYouKnow?.hour?.toString().padStart(2, '0');
    const minute = this.selectedTimeIfYouKnow?.minute
      ?.toString()
      .padStart(2, '0');
    const second = this.selectedTimeIfYouKnow?.second
      ?.toString()
      .padStart(2, '0');
    if (
      this.selectedTimeIfYouKnow == null ||
      this.selectedTimeIfYouKnow == undefined
    ) {
      this.youKnowYourTimeButton = true;
      return;
    } else {
      this.youKnowYourTimeButton = false;
    }
    const formattedTime = `${hour}:${minute}:${second}`;
    let data = JSON.parse(localStorage.getItem('basic_details'));
    data['birthTime'] = formattedTime;
    data['rawFormatbirthTime'] = this.selectedTimeIfYouKnow;

    let userList = localStorage.getItem('userList');
    if (userList == undefined) {
      localStorage.setItem('userList', JSON.stringify([data]));
    } else {
      let parsedData = JSON.parse(userList);
      let getData = parsedData.find(
        (dataum) => dataum.firstName == data?.firstName
      );
      if (!getData) {
        parsedData.push(data);
        localStorage.setItem('userList', JSON.stringify(parsedData));
      }
    }

    localStorage.setItem('basic_details', JSON.stringify(data));
    this.formStep = 4;
  }

  public items = Object.entries(layer1_female_ascendants);
  layer1_male_ascendants;

  public layerItems = [1, 2, 3];

  // Firebase
  public windowRef: any;
  public formStep: number = 0;
  public loadSpinner: boolean = false;

  public maxDate: { year: number; month: number; day: number };

  public signUpForm: FormGroup = this.formBuilder.group({
    firstName: ['', [Validators.required]],
    gender: [null, [Validators.required]],
    dateOfBirth: [null, [Validators.required]],
    // birthTime: [null, [Validators.required]],
    birthPlace: ['', [Validators.required]],
  });

  public cutomeTimeForm: FormGroup = this.formBuilder.group({
    toBirthTime: [null, [Validators.required]],
    fromBirthTime: [null, [Validators.required]],
  });

  public signUpFormSubmitted: boolean = false;

  public basicDetails: any;

  public categoryForm: FormGroup = this.formBuilder.group({
    category: [null, [Validators.required]],
  });
  public categoryFormSubmitted: boolean = false;

  public timeWindowSelect: number = 0;

  public useCheckAnwers = [];

  open(content) {
    const modalRef = this.modalService.open(WalletComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
      scrollable: true,
    });
  }

  options: any[] = [];

  movies$: Observable<any>;
  moviesLoading = false;
  moviesInput$ = new Subject<string>();
  selectedMovie: any;
  minLengthTerm = 3;

  public cacheAnswers = {};

  setCategoryInApi = '';

  constructor(
    // public windowRefService: WindowRefService,
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    public router: ActivatedRoute,
    public route: Router,
    private http: HttpClient,
    public userService: UserService,
    public authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    let included = Object.keys(CATEGORICALMAPPING);
    this.router.queryParamMap.subscribe((params) => {
      this.questionSet.category = included.includes(params.get('cat'))
        ? CATEGORICALMAPPING[params.get('cat')]
        : params.get('cat');
      this.question = this.categoricalQuestion[params.get('cat')];
      this.setCategoryInApi = CATEGORICALMAPPING[params.get('cat')];
    });
    if (this.questionSet.category == 'panchanga') {
      this.signUpForm = this.formBuilder.group({
        event_date: [null, [Validators.required]],
        location: ['', [Validators.required]],
        category: 'panchanga',
        index: 0,
      });
    }
    if (
      this.questionSet.category == 'today_prediction' ||
      this.questionSet.category == 'muhurta_auspicious'
    ) {
      this.signUpForm.addControl(
        'currentLocation',
        this.formBuilder.control('', [Validators.required])
      );
    }
    if (this.questionSet.category == 'muhurta_auspicious') {
      this.signUpForm.addControl(
        'fromDate',
        this.formBuilder.control('', [Validators.required])
      );
      this.signUpForm.addControl(
        'toDate',
        this.formBuilder.control('', [Validators.required])
      );
    }
    const currentDate = new Date();
    this.maxDate = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1, // months are 0-based
      day: currentDate.getDate(),
    };
    this.checkboxForm = this.formBuilder.group({
      checkbox0: false,
      checkbox1: false,
      checkbox2: false,
    });
    this.loadMovies();
    localStorage.removeItem('basic_details');
    this.initializeCategoryForm(); // Initialize category form with selected category
    this.getUserList();
  }

  trackByFn(item: any) {
    return item.imdbID;
  }

  get anyCheckBoxChecked() {
    let values = Object.values(this.checkboxForm.value);
    const someTrue = values.some((ele) => ele === true);
    return someTrue;
  }

  onCheckboxLayerChange(changedCheckbox: string): void {
    if (changedCheckbox === 'checkbox0') {
      this.checkboxForm.patchValue({ checkbox1: false, checkbox2: false });
    } else if (changedCheckbox === 'checkbox1') {
      this.checkboxForm.patchValue({ checkbox0: false, checkbox2: false });
    } else if (changedCheckbox === 'checkbox2') {
      this.checkboxForm.patchValue({ checkbox0: false, checkbox1: false });
    }
  }

  onCheckboxChange(event: Event, item) {
    const checkbox = event.target as HTMLInputElement;
    if (this.useCheckAnwers.includes(item) && !checkbox.checked) {
      let filterData = this.useCheckAnwers.filter((data) => data != item);
      this.useCheckAnwers = filterData;
      let allItems = this.items.map((data: any) => {
        data.checkbox = 0;
        return data;
      });
      this.items = allItems;
    } else {
      this.useCheckAnwers.push(item);
    }

    if (this.useCheckAnwers.length >= 3) {
      let allItems = this.items.map((data: any) => {
        if (!this.useCheckAnwers.includes(data?.ascendants)) {
          data.checkbox = 1;
        }
        return data;
      });

      this.items = allItems;
      return;
    }
  }

  buttonNext() {
    this.loadSpinner = true;
    let data = JSON.parse(localStorage.getItem('basic_details'));
    let apiUrl = `https://backend.raksa.xyz/get_desc_for_chosen_ascs`;

    // Send a POST request with the data in the query string
    this.http
      .post<any>(apiUrl, {
        birthdate: data.dateOfBirth,
        birthlocation: data.birthPlace,
        birthname: data.firstName,
        gender: data.gender,
        category: 'desc',
        index: '0',
        asc_array: this.useCheckAnwers,
      })
      .pipe(
        catchError((error) => {
          // Handle errors
          console.error('Error fetching data:', error);
          return throwError('Error fetching data. Please try again later.');
        })
      )
      .subscribe(
        (resp) => {
          // Handle successful response
          if (resp.Error) {
            console.error('Server returned an error:', resp.Error);
          } else {
            this.layer2Question = resp;
            this.formStep = 1000;
            this.loadSpinner = false;
          }
        },
        (error) => {
          // Handle HTTP error
          console.error('HTTP Error:', error);
          this.loadSpinner = false;

          this.answerText = 'HTTP Error: ' + error.message;
        }
      );
  }

  selectQuestionOnClick(i) {
    this.questionSelected = i;
    this.getAnswer(i);
  }

  buttonNextLayer2() {
    let optionSelected = Object.entries(this.checkboxForm.value);
    let findCheckbox = optionSelected.findIndex((data) => data[1] == true);
    let optionTime = this.layer2Question[findCheckbox].time;
    let data = JSON.parse(localStorage.getItem('basic_details'));
    data['birthTime'] = optionTime;
    let splitDate = optionTime.split(':').map((data) => Number(data));
    let fromatedDate = {
      hour: splitDate[0],
      minute: splitDate[1],
      second: splitDate[2],
    };

    data['rawFormatbirthTime'] = fromatedDate;
    let userList = localStorage.getItem('userList');
    if (userList == undefined) {
      localStorage.setItem('userList', JSON.stringify([data]));
    } else {
      let parsedData = JSON.parse(userList);
      let getData = parsedData.find(
        (dataum) => dataum.firstName == data?.firstName
      );
      if (!getData) {
        parsedData.push(data);
        localStorage.setItem('userList', JSON.stringify(parsedData));
      }
    }
    localStorage.setItem('basic_details', JSON.stringify(data));
    this.formStep = 4;
  }

  openWalletModal(): void {
    const modalRef = this.modalService.open(WalletComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
      scrollable: true,
    });
  }

  loadMovies() {
    this.movies$ = // default items
      this.moviesInput$.pipe(
        filter((res) => {
          return res !== null && res.length >= this.minLengthTerm;
        }),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => (this.moviesLoading = true)),
        switchMap((term) => {
          return this.getMovies(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.moviesLoading = false))
          );
        })
      );
  }

  selectTimeFrame(frame: number) {
    this.timeWindowSelect = frame;
  }

  selectedTimeFrame(time1, time2) {
    let data = JSON.parse(localStorage.getItem('basic_details'));
    this.loadSpinner = true;

    let apiUrl = `https://backend.raksa.xyz/get_ascendants_for_chosen_time?birthdate=${encodeURIComponent(
      data.dateOfBirth
    )}&birthlocation=${encodeURIComponent(
      data.birthPlace
    )}&birthname=${encodeURIComponent(
      data.firstName
    )}&gender=${encodeURIComponent(data.gender)}&category=${encodeURIComponent(
      'category'
    )}&index=${'0'}&time1=${encodeURIComponent(
      time1
    )}&time2=${encodeURIComponent(time2)}`;

    // Send a POST request with the data in the query string
    this.http
      .post<any>(apiUrl, {})
      .pipe(
        catchError((error) => {
          // Handle errors
          console.error('Error fetching data:', error);
          return throwError('Error fetching data. Please try again later.');
        })
      )
      .subscribe(
        (resp) => {
          // Handle successful response
          if (resp.Error) {
            console.error('Server returned an error:', resp.Error);
          } else {
            let getData =
              data?.gender == 'male'
                ? layer1_male_ascendants
                : layer1_female_ascendants;

            let filterData = [];
            resp.map((data) => {
              filterData.push({
                ascendants: data,
                data: getData[data + ' ' + 'Ascendant'],
                checkbox: 0,
              });
            });
            this.items = filterData;
            this.loadSpinner = false;
            this.formStep = 100;
          }
        },
        (error) => {
          // Handle HTTP error
          console.error('HTTP Error:', error);
          this.loadSpinner = false;

          // this.answerText = 'HTTP Error: ' + error.message;
        }
      );
  }

  getMovies(term: string = null): Observable<any> {
    const httpOptions = {
      headers: {
        'X-RapidAPI-Key': 'caeb00ca62msh82e7ceb1a80bcabp142705jsnc0b4069afb3e',
        'X-RapidAPI-Host': 'place-autocomplete1.p.rapidapi.com',
      },
      params: { input: term, radius: '500' },
    };
    return this.http
      .get<any>(
        `https://place-autocomplete1.p.rapidapi.com/autocomplete/json`,
        httpOptions
      )
      .pipe(
        map((resp) => {
          if (resp.Error) {
            throwError(resp.Error);
          } else {
            return resp.predictions;
          }
        })
      );
  }

  get signUpFrm() {
    return this.signUpForm.controls;
  }

  search = (text$: any) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchText) => {
        const httpOptions = {
          headers: {
            'X-RapidAPI-Key':
              'caeb00ca62msh82e7ceb1a80bcabp142705jsnc0b4069afb3e',
            'X-RapidAPI-Host': 'place-autocomplete1.p.rapidapi.com',
          },
          params: { input: 'new', radius: '500' },
        };
        return this.http.get<any[]>(
          `https://place-autocomplete1.p.rapidapi.com/autocomplete/json`,
          httpOptions
        );
      }),
      tap((data) => {
        this.options = [data]; // Update options array with data from API response
      })
    );
  };

  goBackToSignUp(): void {
    let data = JSON.parse(localStorage.getItem('basic_details')!);
    this.signUpForm.patchValue(data);
    this.formStep = 1;
  }

  formatTime(val) {
    const hour = val?.hour?.toString().padStart(2, '0');
    const minute = val?.minute?.toString().padStart(2, '0');
    const second = val?.second?.toString().padStart(2, '0');
    const formattedTime = `${hour}:${minute}:${second}`;
    return formattedTime;
  }
  onGetDataOfpanch(formValues) {
    this.loadSpinner = true;
    let apiUrl = `https://backend.raksa.xyz/${
      this.setCategoryInApi
    }?event_date=${encodeURIComponent(
      formValues.event_date
    )}&location=${encodeURIComponent(
      formValues.location.split(',')[0]
    )}&category=${encodeURIComponent(this.questionSet.category)}&index=${0}`;

    // Send a POST request with the formValues in the query string
    this.http
      .post<any>(apiUrl, {})
      .pipe(
        catchError((error) => {
          // Handle errors
          console.error('Error fetching data:', error);
          return throwError('Error fetching data. Please try again later.');
        })
      )
      .subscribe(
        (resp) => {
          // Handle successful response
          if (resp.Error) {
            console.error('Server returned an error:', resp.Error);
            this.answerText = 'Error: ' + resp.Error;
          } else {
            this.loadSpinner = false;
            this.answerText = resp.message;
            this.formStep = 4;
          }
        },
        (error) => {
          // Handle HTTP error
          console.error('HTTP Error:', error);
          this.loadSpinner = false;

          this.answerText = 'HTTP Error: ' + error.message;
        }
      );
  }

  createProfileInRegistration(): void {
    this.signUpFormSubmitted = true;
    if (this.signUpForm.invalid) {
      return;
    }
    let formValues = this.signUpForm.value;
    if (this.questionSet.category == 'panchanga') {
      formValues['event_date'] =
        formValues['event_date'].year +
        '-' +
        String(formValues['event_date'].month).padStart(2, '0') +
        '-' +
        String(formValues['event_date'].day).padStart(2, '0');
      formValues['location'] = formValues['location'].description;
      this.onGetDataOfpanch(formValues);
      return;
    }

    formValues['showDateOfBirth'] = formValues['dateOfBirth'];
    formValues['dateOfBirth'] =
      formValues['dateOfBirth'].year +
      '-' +
      String(formValues['dateOfBirth'].month).padStart(2, '0') +
      '-' +
      String(formValues['dateOfBirth'].day).padStart(2, '0');
    formValues['birthPlace'] =
      formValues['birthPlace']?.description || formValues['birthPlace'];
    formValues['currentLocation'] =
      formValues['currentLocation']?.description ||
      formValues['currentLocation'] ||
      '';
    formValues['gender'] = formValues['gender'];
    formValues['firstName'] = formValues['firstName'];

    if (this.questionSet.category == 'muhurta_auspicious') {
      formValues['fromDate'] =
        formValues['fromDate'].year +
        '-' +
        String(formValues['fromDate'].month).padStart(2, '0') +
        '-' +
        String(formValues['fromDate'].day).padStart(2, '0');

      formValues['toDate'] =
        formValues['toDate'].year +
        '-' +
        String(formValues['toDate'].month).padStart(2, '0') +
        '-' +
        String(formValues['toDate'].day).padStart(2, '0');
    }

    if (formValues['birthTime']) {
      const hour = formValues['birthTime']?.hour?.toString().padStart(2, '0');
      const minute = formValues['birthTime']?.minute
        ?.toString()
        .padStart(2, '0');
      const second = formValues['birthTime']?.second
        ?.toString()
        .padStart(2, '0');
      const formattedTime = `${hour}:${minute}:${second}`;
      //////////////////
      formValues['birthTime'] = formattedTime;
    }

    localStorage.setItem('basic_details', JSON.stringify(formValues));

    if (formValues['birthTime']) {
      this.deductBalanceFromUserAccount(
        this.authService?.activeUserValue?.uid,
        29
      ).then((data) => {
        this.userService.fetchUserData(this.authService.activeUserValue?.uid);

        this.formStep = 4;
      });
    } else {
      this.deductBalanceFromUserAccount(
        this.authService?.activeUserValue?.uid,
        29
      ).then((data) => {
            this.userService.fetchUserData(
              this.authService.activeUserValue?.uid
            );

        this.formStep = 1;
      });
    }
  }

  customeTimeSelection(): void {
    let formValues = this.cutomeTimeForm.value;
    const toTime = this.formatTime(formValues['toBirthTime']);
    const fromTime = this.formatTime(formValues['fromBirthTime']);
    this.selectedTimeFrame(fromTime, toTime);
  }

  getAnswer(index: number): void {
    this.loadSpinner = true;
    this.answerText = 'LOADING PLEASE WAIT .........';
    if (this.cacheAnswers[index] == undefined) {
      let data = JSON.parse(localStorage.getItem('basic_details'));
      // Check if dateOfBirth is valid
      if (typeof data?.dateOfBirth === 'string') {
        // Construct the URL with query parameters
        let apiUrl = `https://backend.raksa.xyz/${
          this.setCategoryInApi || 'get_horoscope_details'
        }?birthdate=${encodeURIComponent(
          data.dateOfBirth
        )}&birthtime=${encodeURIComponent(
          data.birthTime
        )}&birthlocation=${encodeURIComponent(
          data.birthPlace
        )}&birthname=${encodeURIComponent(
          data.firstName
        )}&gender=${encodeURIComponent(
          data.gender
        )}&category=${encodeURIComponent(
          this.questionSet.category
        )}&index=${index}`;
        if (this.signUpForm.contains('currentLocation')) {
          apiUrl += `&current_location=${encodeURIComponent(
            data.currentLocation.split(',')[0]
          )}`;
        }
        if (
          this.signUpForm.contains('fromDate') &&
          this.signUpForm.contains('toDate')
        ) {
          apiUrl += `&start_date=${encodeURIComponent(
            data.fromDate
          )}&end_date=${encodeURIComponent(data.toDate)}`;
        }
        // Send a POST request with the data in the query string
        this.http
          .post<any>(apiUrl, {})
          .pipe(
            catchError((error) => {
              // Handle errors
              console.error('Error fetching data:', error);
              return throwError('Error fetching data. Please try again later.');
            })
          )
          .subscribe(
            (resp) => {
              // Handle successful response
              if (resp.Error) {
                console.error('Server returned an error:', resp.Error);
                this.answerText = 'Error: ' + resp.Error;
              } else {
                if (this.questionSet.category == 'muhurta_auspicious') {
                  this.answerText = resp;
                  this.cacheAnswers[index] = resp;
                } else {
                  this.answerText = resp.message;
                  this.cacheAnswers[index] = resp.message;
                }
                this.loadSpinner = false;
              }
            },
            (error) => {
              // Handle HTTP error
              console.error('HTTP Error:', error);
              this.loadSpinner = false;

              this.answerText = 'HTTP Error: ' + error.message;
            }
          );
      } else {
        console.error('Invalid dateOfBirth:', data?.dateOfBirth);
        this.answerText = 'Invalid dateOfBirth';
      }
    } else {
      this.answerText = this.cacheAnswers[index];
      this.loadSpinner = false;
    }
  }
  userInput(input: number) {
    this.formStep = input;
  }

  setQuestion(): void {
    this.question =
      this.categoricalQuestion[this.questionSet.category][
        this.questionSet.index
      ];
    this.answerText = '';
  }

  getNextQuestion() {
    let currentQuestionIndex =
      (this.questionSet.index + 1) %
      this.categoricalQuestion[this.questionSet.category].length;
    this.questionSet.index = currentQuestionIndex;
    this.setQuestion();
  }

  getPreviousQuestion() {
    let currentQuestionIndex =
      (this.questionSet.index -
        1 +
        this.categoricalQuestion[this.questionSet.category].length) %
      this.categoricalQuestion[this.questionSet.category].length;
    this.questionSet.index = currentQuestionIndex;
    this.setQuestion();
  }

  backToCategory(): void {
    this.formStep = 0;
    this.answerText = '';
    this.route.navigate(['dashboard']);
  }

  initializeCategoryForm(): void {
    this.categoryForm = this.formBuilder.group({
      category: [this.selectedCategory, Validators.required], // Initialize form with selected category
    });
  }

  async deductBalanceFromUserAccount(uid, amount) {
    if (this.currentUser && this.currentUser['walletBalance']) {
      const data = await this.userService.UpdateUser(uid, {
        walletBalance: this.currentUser['walletBalance'] - amount,
      });
      return data;
    }
  }

  selectCategory(cat: string): void {
    this.deductBalanceFromUserAccount(
      this.authService?.activeUserValue?.uid,
      1
    ).then((data) => {
      this.questionSet = { category: cat, index: 0 };
      this.setQuestion();
      this.formStep = 3;
      this.selectedCategory = cat; // Get selected category from form
      localStorage.setItem('selectedCategory', this.selectedCategory); // Save selected category to local storage
      // Use this.selectedCategory as needed
    });
  }
}
