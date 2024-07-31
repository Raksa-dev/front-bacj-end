import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-typewrittereffect',
  templateUrl: './typewrittereffect.component.html',
  styleUrls: ['./typewrittereffect.component.scss'],
})
export class TypewrittereffectComponent implements OnInit {
  sentences: string[] = [
    'When will I get married ?',
    'Will she come back to me ?',
    'Should I start a business ?',
    'When will I be healthy again ?',
    'What will my day be like ?',
    'Will I ever fall in love again ?',
  ];
  displayedText: string = '';
  typingSpeed: number = 100; // milliseconds per character
  sentenceIndex: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.typeWriter();
  }

  typeWriter(): void {
    if (this.sentenceIndex < this.sentences.length) {
      let sentence = this.sentences[this.sentenceIndex];
      let i = 0;
      this.displayedText = '';

      const interval = setInterval(() => {
        if (i < sentence.length) {
          this.displayedText += sentence.charAt(i);
          i++;
        } else {
          clearInterval(interval);
          this.sentenceIndex++;
          setTimeout(() => {
            if (this.sentenceIndex >= this.sentences.length) {
              this.sentenceIndex = 0;
            }
            this.displayedText = '';
            this.typeWriter();
          }, 1000); // wait 1 second before starting the next sentence
        }
      }, this.typingSpeed);
    }
  }
}
