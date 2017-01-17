import {Injectable, PipeTransform, Pipe} from '@angular/core';

/**
 * Transforms any input value
 */
@Pipe({
  name: 'removeTags'
})
@Injectable()
export class PrestaPipe implements PipeTransform {
  /*
   Takes a value and removes html tags.
  */
 transform(value: any) {
   value = value + ''; // make sure it's a string
   return value ? String(value).replace(/<[^>]+>/gm, '') : '';
 }
}
