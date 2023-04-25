import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indexOf'
})
export class IndexOfPipe implements PipeTransform {

  transform(items: {key: string, value: any}[], key: string): number {
    let keys = Object.keys(items);
    return keys.indexOf(key);
  }
}
