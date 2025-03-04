import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'TStoDate',
  standalone: true
})
export class TimestampToDatePipe implements PipeTransform {

  transform(time: Timestamp,): Date | string {
    if(!time) return 'Sin fecha registrada';
    return time.toDate().toLocaleString();
  }

}
