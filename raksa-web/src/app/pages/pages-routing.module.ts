import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { CallComponent } from './call/call.component';
import { LiveComponent } from './live/live.component';
import { AdminComponent } from './admin/admin.component';
import { authGuard } from '../auth/auth.guard';
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
import { AboutCallComponent } from './call/about/about.component';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogComponent } from './blogs/blog/blog.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { LearnComponent } from './learn/learn.component';
import { BookComponent } from './book/book.component';
import { NewlandingpageComponent } from './newlandingpage/newlandingpage.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WhyraksaComponent } from './whyraksa/whyraksa.component';
import { OurstoryComponent } from './ourstory/ourstory.component';
import { OurphilosophyComponent } from './ourphilosophy/ourphilosophy.component';
import { PricingComponent } from './pricing/pricing.component';
import { UserlandingpageComponent } from './userlandingpage/userlandingpage.component';
import { MuhurtaComponent } from './muhurta/muhurta.component';
import { LoshuGridComponent } from './loshu-grid/loshu-grid.component';
import { WhoAmIComponent } from './who-am-i/who-am-i.component';

const routes: Routes = [
  {
    path: '',
    component: NewlandingpageComponent,
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'horoscopes',
    component: HoroscopesComponent,
  },
  {
    path: 'horoscope/:zodiac',
    component: HoroscopeComponent,
  },
  {
    path: 'chat',
    children: [
      { path: '', component: ChatComponent },
      {
        path: 'about/:id',
        component: AboutAstrolgerComponent,
      },
    ],
  },
  {
    path: 'call',
    children: [
      { path: '', component: CallComponent },
      {
        path: 'about/:id',
        component: AboutCallComponent,
      },
    ],
  },
  {
    path: 'learn',
    children: [
      { path: '', component: LearnComponent },
      {
        path: 'more/:id',
        component: AboutCallComponent,
      },
    ],
  },
  {
    path: 'blogs',
    children: [
      { path: '', component: BlogsComponent },
      { path: 'blog/:slug', component: BlogComponent },
    ],
  },
  {
    path: 'invoice',
    children: [{ path: ':id', component: InvoiceComponent }],
  },
  {
    path: 'whyraksa',
    component: WhyraksaComponent,
  },
  {
    path: 'our-story',
    component: OurstoryComponent,
  },
  {
    path: 'our-philosophy',
    component: OurphilosophyComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
  },
  {
    path: 'about-ous',
    component: AboutousComponent,
  },
  {
    path: 'contact-ous',
    component: ContactousComponent,
  },
  {
    path: 'userlandingpage',
    component: UserlandingpageComponent,
  },
  {
    path: 'pricing',
    component: PricingComponent,
  },
  {
    path: 'muhurta',
    component: MuhurtaComponent,
  },
  {
    path: 'who-am-i',
    component: WhoAmIComponent,
  },
  {
    path: 'loshu-grid',
    component: LoshuGridComponent,
  },
  {
    path: 'privacy-policy',
    component: PrivacypolicyComponent,
  },
  {
    path: 'terms-and-conditions',
    component: TermsandconditionsComponent,
  },
  {
    path: 'transaction',
    component: TransactionComponent,
  },
  {
    path: 'astrologer',
    component: AstrologerComponent,
  },
  {
    path: 'live',
    component: LiveComponent,
  },
  {
    path: 'flames',
    component: FlamesComponent,
  },
  {
    path: 'match-making',
    component: MatchMakingComponent,
  },
  {
    path: 'book',
    component: BookComponent,
    canActivate: [authGuard],
  },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [authGuard],
})
export class PagesRoutingModule {}
export const RoutingComponents = [
  HomeComponent,
  ChatComponent,
  CallComponent,
  LiveComponent,
];
