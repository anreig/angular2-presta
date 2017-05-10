import { Injectable, Inject } from '@angular/core';
import {Http, Response} from '@angular/http';
// Import rxjs operators
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/retryWhen';
// Import presta configuration and Query
import {PrestaConfiguration, Query, ImageSize} from './presta.interfaces';

@Injectable()
export class PrestaService {

  private TAG: string = 'PRESTA SERVICE: ';

  constructor(
    private http: Http,
    @Inject('prestaConfiguration') private config: PrestaConfiguration
  ) {
    console.log(`${this.TAG} is running ....`);
  }

  /**
   * [requestConstructor : analyze Query object, construct and return request url]
   * @param  {Query}  q [Query object]
   * @return {[string]}   [request url]
   */
  requestConstructor(q: Query) {

    // check if params are set, if not set default values
    if (!q.resource) { q.resource = 'products' }

    // Check if display is set if not return results with all properties
    !q.display ? q.display = `&display=full` : q.display = `&display=[${q.display}]`;

    // Generate filter query from Query.filter object if it is defined
    var filterQuery = '';

    if (q.filter) {
      for (let property in q.filter) {
        filterQuery += `&filter[${property}]=[${q.filter[property]}]`;
      }
    }

    !q.sort ? q.sort = '' : q.sort = `&sort=[${q.sort}]`;
    !q.limit ? q.limit = '' : q.limit = `&limit=${q.limit}`;

    if (!q.search) {
      return `${this.config.shopUrl}${q.resource}?ws_key=${this.config.apiKey}&output_format=JSON${q.display}${filterQuery}${q.sort}${q.limit}`;
    } else {
      return `${this.config.shopUrl}search?ws_key=${this.config.apiKey}&output_format=JSON&language=1${q.display}${filterQuery}&query=${q.search}`;
    }

  }

  /**
   * [get results from presta shop web service]
   * @param  {Query}           q [query object]
   * @return {Observable<any>}   [results object array]
   */
  get(q: Query): Observable<any> {

    return this.http
      .get(this.requestConstructor(q))
      .map((results: Response) => results.json()[q.resource])
      .catch((error: any) => {
        return Observable.throw(new Error(`${this.TAG} Error getting ${q.resource}: ${error.status} => ${error.message}`));
      });

  }

  /**
 * [search]
 * @param  {Query}           q [query object with search term provided]
 *
 * @return {Observable<Response>}   [return results object array]
 */
  search(q: Query): Observable<any> {

    return this.http
      .get(this.requestConstructor(q))
      .map((results: Response) => results.json()[q.resource])
      .catch((error: any) => {
        return Observable.throw(new Error(`${this.TAG} Error searching ${q.resource}: ${error.json().error.status} => ${error.message}`));
      });

  }

  /**
   * [getImage used by PrestaImage component to get images from Presta Shop Web Service]
   * @param  {string}          resource   [general, products, categories, manufacturers, suppliers, stores]
   * @param  {number}          resourceID [ID of resurce to get images for]
   * @param  {number}          imageID    [ID of image to get]
   * @param  {string}          imageSize  [cart_default, small_default, medium_default, large_default, thickbox_default, home_default, category_default]
   * @return {Observable<any>}            [url]
   */
  getImage(resource: string, resourceID: number, imageID: number, imageSize?: ImageSize): Observable<any> {

    // check if imageApiKey is defined if not use default apiKey (not recomended for security reasons)
    let key: string = '';
    !this.config.imageApiKey ? key = this.config.apiKey : key = this.config.imageApiKey;

    //check if image size is defined if not get large images by default
    if (!imageSize) { imageSize = ImageSize.large_default }

    return this.http
      .get(`${this.config.shopUrl}images/${resource}/${resourceID}/${imageID}/${ImageSize[imageSize]}?ws_key=${key}`)
      .retryWhen((error) => error.delay(500))
      .timeout(2000)
      .map((result: Response) => result.url)
      .catch((error) => {
        return Observable.throw(new Error(`${this.TAG} Error getting ${resource} image: ${error.status} => ${error.message}`));
      });

  }
}
