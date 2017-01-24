import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
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
            return `${this.config.shopUrl}${q.resource}?ws_key=${this.config.apiKey}&output_format=JSON${q.display}${filterQuery}${q.sort}`;
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
            .map((result: Response) => result.json()[q.resource]);

    }

    /**
   * [search]
   * @param  {Query}           q [query object with search term provided]
   * @return {Observable<any>}   [return results object array]
   */
    search(q: Query): Observable<any> {

        return this.http
            .get(this.requestConstructor(q))
            .map((results: Response) => results.json()[q.resource]);

    }

}
