import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
import { Router } from '@angular/router';
import { WalletComponent } from 'src/app/shared/wallet/wallet.component';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent implements OnInit {
  selectedCategory: string;
  public categoricalQuestion = {
    self_awareness: [
      'Can you provide insights about my personality based on my birth chart ?',
      'What are the strengths and weaknesses indicated in my birth chart?',
      'Generate insights about my general demeanor and approach to life based on my ascendant sign',
      'How do the planets housed in my ascendant house impact my personality?',
      'How does my Sun sign contribute to my personality traits?',
      'What insights can you provide about my personality from the planetary positions in different " \
      "houses in my vedic horoscope? ',
      'How do I typically appear to others upon first impression  ?',
      'What are my primary motivations and desires in life  ?',
      'How do I typically respond to new situations and challenges ?',
      'What are my primary motivations and desires in life according to my astrological information ?',
      'How do I typically respond to new situations and challenges according to my astrological information ?',
      'What are my natural strengths and talents according to my astrological information ?',
      'What are the negatives in my horoscope ?',
      'How do I tend to approach relationships and social interactions according to my astrological information ?',
      'How do I express myself creatively and artistically according to my astrological information ?',
      'What are my natural inclinations and preferences in terms of lifestyle and environment according to my astrological information ?',
      'What are my tendencies in terms of self-care and well-being according to my astrological information ?',
      'What steps can I take to enhance my overall well-being and happiness according to my astrological information ?',
    ],
    family: [
      'What does my birth chart suggest about my family dynamics?',
      'How do the planetary positions in my birth chart influence my relationships with family " \
      "members?',
      'Are there any specific planetary placements that indicate challenges or conflicts within my " \
      "family?',
      'Are there any karmic or past-life connections indicated in my birth chart that influence my " \
      "family dynamics? ',
      'What role do the Moon and Venus placements play in shaping my emotional connections and bonds " \
      "with family members?',
      'Are there any astrological remedies or practices I can incorporate to foster harmony and " \
      "unity within my family?',
    ],
    wealth: [
      'Can astrology provide insights into my spending habits and tendencies based on my astrological profile',
      'What career paths or investment opportunities align with my astrological profile',
      'How can I mitigate financial risks and maximize opportunities based on my astrological profile',
      'What steps can I take to manifest abundance and financial success based on my astrological profile',
      'How can I align my financial goals with my life purpose and astrological chart based on my astrological profile',
      'What is my natural inclination towards handling money and finances based on my astrological profile',
      'What areas of my life should I focus on to improve my overall financial well-being based on " \
      "my astrological profile',
      'Are there any planetary placements or aspects that indicate a need for caution in financial matters based on my astrological profile',
      'What role does karma or past-life influences play in shaping my current financial situation based on my astrological profile',
      'Can astrology help me identify the most auspicious timing for major financial decisions or investments?',
    ],
    health: [
      'Can you predict any health issues or concerns in the near future based on my astrological profile?',
      'What sort of health issues will I have according to my astrological profile? ',
      'How can I maintain good physical health based on my birth chart?',
      'Give me 5 strengths and weaknesses related to health based on my astrological profile?',
      'Will I experience emotional stability or fluctuations in mood based on my astrological profile?',
      'Can you suggest coping strategies or therapies for emotional healing based on my astrological profile?',
    ],
    numerology: [
      'What insights can numerology provide about my personality traits, strengths, and weaknesses?',
      'How does my life path number influence the major events and opportunities in my life?',
      'Can numerology help me understand my relationships with others, including family, friends, and romantic partners?',
      'Are there any significant numbers or patterns in my numerology chart that indicate areas of focus or potential challenges?',
      'How can I use numerology to make informed decisions about my career, finances, and personal growth?',
    ],
    travel: [
      'Can you predict any travel opportunities or relocations for me based on my astrological profile?',
      'Can you suggest destinations that align with my astrological profile based on my astrological profile?',
      'How can I ensure safe and enjoyable travels based on my birth chart?',
    ],
    business: [],
  };

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
  public answerLoading = false;

  public question =
    'Question will appear here,Question will appear here,Question will  appear here,Question will appear here,Question will appear here,Question will appear here,Question will appear here,Questionwill appear here,Question will appear here,Question will appear here';

  public answerText = '';

  // Firebase
  public windowRef: any;
  public formStep: number = 1;
  public loadSpinner: boolean = false;

  public signUpForm: FormGroup = this.formBuilder.group({
    firstName: ['', [Validators.required]],
    gender: [null, [Validators.required]],
    dateOfBirth: [null, [Validators.required]],
    birthTime: [null, [Validators.required]],
    birthPlace: ['', [Validators.required]],
  });
  public signUpFormSubmitted: boolean = false;

  public basicDetails: any;

  public categoryForm: FormGroup = this.formBuilder.group({
    category: [null, [Validators.required]],
  });
  public categoryFormSubmitted: boolean = false;

  options: any[] = [];

  movies$: Observable<any>;
  moviesLoading = false;
  moviesInput$ = new Subject<string>();
  selectedMovie: any;
  minLengthTerm = 3;

  constructor(
    // public windowRefService: WindowRefService,
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    public router: Router,
    private http: HttpClient,
    public userService: UserService,
    public authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    console.log('this si currentuser:', this.currentUser);
    console.log('this is auth services:', this.authService.activeUserValue);
    this.loadMovies();
    localStorage.removeItem('basic_details');
    this.initializeCategoryForm(); // Initialize category form with selected category
  }

  trackByFn(item: any) {
    return item.imdbID;
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

  createProfileInRegistration(): void {
    this.signUpFormSubmitted = true;
    if (this.signUpForm.invalid) {
      return;
    }
    let formValues = this.signUpForm.value;
    formValues['dateOfBirth'] = new Date(
      Date.UTC(
        formValues['dateOfBirth'].year,
        formValues['dateOfBirth'].month - 1,
        formValues['dateOfBirth'].day
      )
    );
    formValues['birthPlace'] = formValues['birthPlace'].description;
    formValues['gender'] = formValues['gender'];
    formValues['firstName'] = formValues['firstName'];
    // format birthtime
    const hour = formValues['birthTime']?.hour?.toString().padStart(2, '0');
    const minute = formValues['birthTime']?.minute?.toString().padStart(2, '0');
    const second = formValues['birthTime']?.second?.toString().padStart(2, '0');
    const formattedTime = `${hour}:${minute}:${second} ${
      formValues['birthTime']?.hour >= 12 ? 'PM' : 'AM'
    }`;
    //////////////////
    formValues['birthTime'] = formattedTime;
    this.formStep = 2;
    localStorage.setItem('basic_details', JSON.stringify(formValues));
  }

  getAnswer(): void {
    this.loadSpinner = true;
    this.answerText = 'LOADING PLEASE WAIT .........';
    console.log('Getting answers...');
    let data = JSON.parse(localStorage.getItem('basic_details'));
    console.log(data.dateOfBirth);
    console.log(data.birthPlace);
    console.log(data.birthTime);
    console.log(data.firstName);
    console.log(data.gender);
    console.log(this.questionSet.category);
    console.log(this.questionSet.index);
    // Check if dateOfBirth is valid
    if (typeof data?.dateOfBirth === 'string') {
      // Construct the URL with query parameters
      let apiUrl = `https://backend.raksa.xyz/get_horoscope_details?birthdate=${encodeURIComponent(
        data.dateOfBirth
      )}&birthtime=${encodeURIComponent(
        data.birthTime
      )}&birthlocation=${encodeURIComponent(
        data.birthPlace
      )}&birthname=${encodeURIComponent(
        data.firstName
      )}&gender=${encodeURIComponent(
        data.gender
      )}&category=${encodeURIComponent(this.questionSet.category)}&index=${
        this.questionSet.index
      }`;

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
              console.log('Server response:', resp.message);
              this.loadSpinner = false;
              this.answerText = resp.message;
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
    this.formStep = 2;
    let data = localStorage.getItem('basic_details');
    this.answerText = '';
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
