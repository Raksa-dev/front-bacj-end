import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-match-making',
  templateUrl: './match-making.component.html',
  styleUrls: ['./match-making.component.scss'],
})
export class MatchMakingComponent {
  constructor(
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}
  public form: FormGroup = this.formBuilder.group({
    boyName: ['', [Validators.required]],
    boyDob: ['', [Validators.required]],
    boyTob: [null, [Validators.required]],
    boyPob: [null, [Validators.required]],
    girlName: [null, [Validators.required]],
    girlDob: ['', [Validators.required]],
    girlTob: [null, [Validators.required]],
    girlPob: [null, [Validators.required]],
  });
  // Function to generate a random score within the given range
  generateRandomScore(maxPoints) {
    return Math.floor(Math.random() * (maxPoints + 1));
  }

  // Function to generate random Ashtakoot scores
  generateRandomAshtakootScore(birthDateTimeBoy, birthDateTimeGirl) {
    const kootas = [
      { name: 'Varna', maxPoints: 1, description: 'Natural Refinement / Work' },
      {
        name: 'Vashya',
        maxPoints: 2,
        description: 'Innate Giving / Attraction towards each other',
      },
      {
        name: 'Tara',
        maxPoints: 3,
        description: 'Comfort - Prosperity - Health',
      },
      { name: 'Yoni', maxPoints: 4, description: 'Intimate Physical' },
      { name: 'Maitri', maxPoints: 5, description: 'Friendship' },
      { name: 'Gan', maxPoints: 6, description: 'Temperament' },
      {
        name: 'Bhakut',
        maxPoints: 7,
        description:
          'Constructive Ability / Constructivism / Society and Couple',
      },
      { name: 'Nadi', maxPoints: 8, description: 'Progeny / Excess' },
    ];

    let totalScore = 0;
    let kootaScores = {};

    for (let koota of kootas) {
      const score = this.generateRandomScore(koota.maxPoints);
      kootaScores[koota.name] = {
        description: koota.description,
        total_points: koota.maxPoints,
        received_points: score,
      };
      totalScore += score;
    }

    const result = {
      ...kootaScores,
      total: {
        total_points: 36,
        received_points: totalScore,
        minimum_required: 18,
      },
      conclusion: {
        report: totalScore >= 18 ? 'Favorable Match' : 'Unfavorable Match',
      },
    };

    return result;
  }

  // Function to generate HTML content from the score data
  generateAshtakootHTML(scoreData) {
    let htmlContent = '<div>';

    for (const koota in scoreData) {
      if (koota !== 'total' && koota !== 'conclusion') {
        htmlContent += `<h3>${koota}</h3>`;
        htmlContent += `<p>Description: ${scoreData[koota].description}</p>`;
        htmlContent += `<p>Points: ${scoreData[koota].received_points} / ${scoreData[koota].total_points}</p>`;
      }
    }

    htmlContent += `<h3>Total Score</h3>`;
    htmlContent += `<p>Total Points: ${scoreData.total.received_points} / ${scoreData.total.total_points}</p>`;
    htmlContent += `<h3>Conclusion</h3>`;
    htmlContent += `<p>${scoreData.conclusion.report}</p>`;

    htmlContent += '</div>';
    return htmlContent;
  }

  submitForm(): void {
    if (this.form.invalid) {
      return;
    }
    let formValues = this.form.value;
    const ashtakootScore = this.generateRandomAshtakootScore(
      '2000-01-01T00:00:00',
      '2000-01-01T00:00:00'
    );
    const htmlOutput = this.generateAshtakootHTML(ashtakootScore);
    document.getElementById('ashtakootScore').innerHTML = htmlOutput;
  }

  open(content: TemplateRef<any>) {
    this.modalService
      .open(content, {
        backdrop: 'static',
        keyboard: false,
        centered: true,
        size: 'lg',
        scrollable: true,
      })
      .result.then()
      .catch((res) => {
        console.log(res);
      });
  }
}
