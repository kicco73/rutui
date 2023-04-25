import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keys'
})
export class KeysPipe implements PipeTransform {

  transform(value: {[key: string]: any}): string[] {
    return Object.keys(value);
  }

}
