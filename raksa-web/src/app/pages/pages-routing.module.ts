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

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
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
