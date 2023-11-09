import { Component } from '@angular/core';

@Component({
  selector: 'app-flames',
  templateUrl: './flames.component.html',
  styleUrls: ['./flames.component.scss'],
})
export class FlamesComponent {
  checkCompatibility() {
    var boyName = (
      document.getElementById('boyName') as HTMLInputElement
    )?.value.trim();
    var girlName = (
      document.getElementById('girlName') as HTMLInputElement
    )?.value.trim();

    if (boyName === '' || girlName === '') {
      alert('Please enter both names.');
      return;
    }

    var compatibility = this.calculateCompatibility(boyName, girlName);
    document.getElementById('result').innerText =
      'Compatibility Score: ' + compatibility + '%';
  }

  calculateCompatibility(name1, name2) {
    // Simple algorithm: sum the char codes of the names and modulo by 100
    var sum = 0;
    for (var i = 0; i < name1.length; i++) {
      sum += name1.charCodeAt(i);
    }
    for (var j = 0; j < name2.length; j++) {
      sum += name2.charCodeAt(j);
    }
    return sum % 100;
  }
}
