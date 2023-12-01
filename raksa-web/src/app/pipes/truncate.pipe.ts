import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: number, digits: number = 2): number {
    const multiplier = Math.pow(10, digits);
    return Math.floor(value * multiplier) / multiplier;
  }
}
