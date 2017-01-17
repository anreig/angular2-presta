import {Injectable, Inject} from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { PrestaConfiguration, Query } from './presta.interfaces';

@Injectable()
export class PrestaService {

  constructor(
    private http: Http,
    @Inject('prestaConfiguration') private config: PrestaConfiguration
  ) {
    console.log('Presta Service is running ...');
  }

  /**
   * [get results from presta shop web service]
   * @param  {Query}  q [query object]
   * @return {[results]} [return results object array]
   */
  get(q: Query) {

    // check if params are set, if not set default values
    if(!q.resource) { q.resource = 'products' }
    !q.display ? q.display = '&display=full' : q.display = '&display=[' + q.display + ']';
    !q.filter ? q.filter = '' : q.filter = '&filter[' + q.filter + ']=[' + q.filterArgs + ']';
    !q.sort ? q.sort = '' : q.sort = '&sort=[' + q.sort + ']';
    !q.limit ? q.limit = '' : q.limit = '&limit=' + q.limit;

    // send http get request to presta shop api and return list of results as json
    return this.http
                .get( this.config.shopUrl + q.resource + this.config.apiKey + '&output_format=JSON' + q.display + q.filter + q.sort )
                .map( result => result.json()[q.resource] );

  }


}
