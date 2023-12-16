import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AuthService, UserService } from 'src/app/core/services';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  constructor(
    public activateRoute: ActivatedRoute,
    public authService: AuthService,
    public userService: UserService
  ) {}
  @ViewChild('contentToPrint') contentToPrint!: ElementRef;
  userData;
  transactionData;
  paymentMode;
  ngOnInit(): void {
    this.activateRoute.params.subscribe((params) => {
      if (params?.id.split('_')[0] == 'pe') {
        this.paymentMode = 'pe';
      } else {
        this.paymentMode = 'cc';
      }

      this.userService
        .fetchUserData(
          this.authService.activeUserValue['uid'],
          this.authService.activeUserValue
        )
        .then((data) => {
          this.userData = {
            ...data,
            authData: this.authService.activeUserValue,
          };
        });
      this.userService.getTransaction(params?.id).then((data) => {
        this.transactionData = data;
      });
    });
  }

  printAsPDF() {
    const content = this.contentToPrint.nativeElement;

    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('export.pdf');
    });
  }
}
