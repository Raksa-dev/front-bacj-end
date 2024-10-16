import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  NgbModule,
  NgbModalModule,
  NgbNavModule,
  NgbToastModule,
  NgbActiveModal,
} from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgSelectModule } from '@ng-select/ng-select';

import { PagesRoutingModule, RoutingComponents } from './pages-routing.module';
import { AdminComponent } from './admin/admin.component';
import { LinkcreationComponent } from './admin/linkcreation/linkcreation.component';
import { AboutousComponent } from './aboutous/aboutous.component';
import { ContactousComponent } from './contactous/contactous.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { TermsandconditionsComponent } from './termsandconditions/termsandconditions.component';
import { TransactionComponent } from './transaction/transaction.component';
import { AstrologerComponent } from './astrologer/astrologer.component';
import { HoroscopesComponent } from './horoscopes/horoscopes.component';
import { HoroscopeComponent } from './horoscopes/horoscope/horoscope.component';
import { FlamesComponent } from './flames/flames.component';
import { MatchMakingComponent } from './match-making/match-making.component';
import { AboutAstrolgerComponent } from './chat/about/about.component';
import { CustomeTimePickerComponent } from '../custome-time-picker/custome-time-picker.component';
import { AboutCallComponent } from './call/about/about.component';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogComponent } from './blogs/blog/blog.component';
import { BlogCreationComponent } from './admin/blog-creation/blog-creation.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { LearnComponent } from './learn/learn.component';
import { BookComponent } from './book/book.component';
import { NewlandingpageComponent } from './newlandingpage/newlandingpage.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TypewrittereffectComponent } from '../shared/typewrittereffect/typewrittereffect.component';
import { WhyraksaComponent } from './whyraksa/whyraksa.component';
import { OurstoryComponent } from './ourstory/ourstory.component';
import { OurphilosophyComponent } from './ourphilosophy/ourphilosophy.component';
import { PricingComponent } from './pricing/pricing.component';
import { UserlandingpageComponent } from './userlandingpage/userlandingpage.component';

@NgModule({
  declarations: [
    RoutingComponents,
    AdminComponent,
    LinkcreationComponent,
    AboutousComponent,
    ContactousComponent,
    PrivacypolicyComponent,
    TermsandconditionsComponent,
    TransactionComponent,
    AstrologerComponent,
    HoroscopesComponent,
    HoroscopeComponent,
    FlamesComponent,
    MatchMakingComponent,
    AboutAstrolgerComponent,
    AboutCallComponent,
    BlogsComponent,
    BlogComponent,
    BlogCreationComponent,
    InvoiceComponent,
    LearnComponent,
    BookComponent,
    NewlandingpageComponent,
    DashboardComponent,
    TypewrittereffectComponent,
    WhyraksaComponent,
    OurstoryComponent,
    OurphilosophyComponent,
    PricingComponent,
    UserlandingpageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbModalModule,
    NgbNavModule,
    CarouselModule,
    NgSelectModule,
    PagesRoutingModule,
    NgbToastModule,
    CustomeTimePickerComponent,
  ],
  providers: [NgbActiveModal],
})
export class PagesModule {}
