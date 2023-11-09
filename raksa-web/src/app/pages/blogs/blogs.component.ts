import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Astrologer } from 'src/app/core/models';
import { UserService } from 'src/app/core/services';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss'],
})
export class BlogsComponent {
  constructor(
    private modalService: NgbModal,
    public userService: UserService
  ) {}
  public astrologers: Astrologer[] = [
    {
      _id: 1,
      avatar: '../../../assets/images/astrologer/avatar-1.png',
      astrologerName: 'Pandit Pradeep',
      experience: '10+ years of experience',
      tags: 'Palm reading, Tarrot Cards, Numerology',
      rating: 4.5,
      reviews: 1000,
      online: true,
    },
  ];

  public openFilter(content: any): void {
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
  }
  async openPaymentForm() {
    // (await this.userService.GetCcavenuePaymentForm()).subscribe(
    //   (data: string) => {
    //     let child = window.open('about:blank', 'myChild');
    //     child.document.write(data);
    //     child.document.close();
    //   }
    // );
  }
}
