import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  NgbModule,
  NgbModalModule,
  NgbNavModule,
  NgbDatepickerModule,
  NgbTimepickerModule,
  NgbAccordionModule,
  NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgOtpInputModule } from 'ng-otp-input';

import { AppComponent } from './app.component';
import { LoginComponent } from './shared/login/login.component';

import { CustomeTimePickerComponent } from './custome-time-picker/custome-time-picker.component';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

// Firebase
// import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { ProfileComponent } from './shared/profile/profile.component';
import { ChatuiComponent } from './shared/chatui/chatui.component';
import { ChatnotificationsComponent } from './shared/chatnotifications/chatnotifications.component';
import { CallnotificationsComponent } from './shared/callnotifications/callnotifications.component';
import { WalletComponent } from './shared/wallet/wallet.component';
import { CalluiComponent } from './shared/callui/callui.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { TransactionComponent } from './shared/transaction/transaction.component';
import { SessionsComponent } from './shared/sessions/sessions.component';
import { TypewrittereffectComponent } from './shared/typewrittereffect/typewrittereffect.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    ChatuiComponent,
    ChatnotificationsComponent,
    CallnotificationsComponent,
    WalletComponent,
    CalluiComponent,
    TruncatePipe,
    TransactionComponent,
    SessionsComponent,
    // TypewrittereffectComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbModalModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbDatepickerModule,
    NgSelectModule,
    NgxIntlTelInputModule,
    NgOtpInputModule,
    AppRoutingModule,
    NgbTimepickerModule,
    CustomeTimePickerComponent,
    HttpClientModule,

    // AngularFireModule.initializeApp(environment.firebaseConfig),
    // AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,

    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
