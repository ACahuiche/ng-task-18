import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {

  transform(text: string, limit:number = 10, sufix:string = '...'): string {
    if(!text) return '';
    return text.length > limit ? text.substring(0, limit) + sufix : text;
  }

}
