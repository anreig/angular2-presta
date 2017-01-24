# angular2-presta
[![Build Status](https://travis-ci.org/SKaDiZZ/angular2-presta.svg?branch=master)](https://travis-ci.org/SKaDiZZ/angular2-presta)

Angular 2 services for consuming PrestaShop API ...

This library should help developers coding angular 2 and ionic 2 apps consuming PrestaShop API.

## Installation

To install this library, run:

```bash
$ npm install angular2-presta --save
```

## Bootstrap

and then from your Angular 2 App Module:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Import angular2-presta module
import { PrestaModule, PrestaConfiguration, PrestaPipe } from 'angular2-presta';

import { AppComponent } from './app.component';

// Add your presta web service api key and shop url
export const prestaConfiguration: PrestaConfiguration = {
  apiKey: 'YOUR_PRESTA_API_KEY',
  shopUrl: 'http://yourshop.com/api/'
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PrestaModule.forRoot(prestaConfiguration)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Using PrestaService

```typescript
import { Component } from '@angular/core';
import {Observable} from 'rxjs/Observable';

// Import presta service and Query
import { PrestaService, Query } from 'angular2-presta';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PrestaService]
})
export class AppComponent {

  items: Observable<any>;

  constructor(private _prestaService: PrestaService) {

    // construct Query
    let query: Query = {
      resource : 'products',
      display  : 'id, id_default_image, name, price, description_short, condition',
      filter: {
        name: 'blouse',
        condition: 'new'
      },
      sort: 'name_ASC',
      limit: '1'
    };

    // pass Query to presta service and subscribe to get results
    this._prestaService.get(query)
                       .subscribe(results => this.items = results);

  }

}
```

## Constructing Query

For now only GET method is supported, no posting or updating data is available.

Query options:

- resource: **string** > Select type of results: products, categories, customers ...
- display : **string** > Allows you to limit result fields to only those you need, by default it will return all fields
- filter: **Object** > object defining fields and values to filter results by
- sort: **string** > sort results by: 'id_ASC', 'id_DESC', 'name_ASC', 'name_DESC' ...
- limit: **string** > limit number of results, or define range of results '5', '9,5'
- search: **string** > search term to use for presta web service search

### Get product categories

```typescript
let query: Query = {
    resource: 'categories'
  };
```

### Get products by category

```typescript
let query: Query = {
    resource: 'products',
    filter: {
      id_category_default: '11'
    }
  };
```

### Get product by id

```typescript
let query: Query = {
    resource: 'products',
    filter: {
      id: '1'
    }
  };

  this._prestaService.get(query)
                     .subscribe(results => this.items = results[0]);
```

## Using search

Search Query can accept search and resource fields. By default search will return list of products if no other resource is defined.

```typescript
let query: Query = {
    search: 'blouse'
  };

this._prestaService.search(query)
                   .subscribe(results => this.items = results);
```

### Search categories

```typescript
let query: Query = {
    resource: 'categories'
    search: 'dresses'
  };

this._prestaService.search(query)
                   .subscribe(results => this.items = results);
```

## Outputing data

Some of the Presta web service results come with html tags included to filter out tags you can use removeTags pipe.

```html
<ul *ngIf="items">
  <li *ngFor="let item of items">
    <h1>{{ item.name }}</h1>
    <p>{{ item.description_short | removeTags }}</p>
    <p>{{ item.price | currency }}<p>
  </li>
</ul>
```

## Roadmap

- [x] GET requests, filtering, sorting
- [x] Search support
- [ ] Product images support
- [ ] POST requests
- [ ] UPDATE requests
- [ ] DELETE requests

## Latest updates

- ### v0.1.4 - v0.1.5
  Updated documentation

- ### v0.1.3
  Added support for search, code optimized, many fixes

- ### v0.1.2
  Added support for more then one filter

## License

MIT © [Samir Kahvedzic](mailto:akirapowered@gmail.com)
