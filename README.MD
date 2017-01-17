# angular2-presta

This is beta version, with many bugs and missing features, only for testing ...

Angular 2 Presta library should make your life easier when you are developing angular 2 or ionic 2 apps which are using Presta Shop web services. Library adds PrestaService which allows you to use many of features like getting: products, categories, images and filtering and sorting data you are getting.

## Installation

To install this library, run:

```bash
$ npm install angular2-presta --save
```

## Setup

and then from your Angular `AppModule`:

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
  apiKey: '?ws_key=enter your presta api key',
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

For now only GET is supported so no posting or updating data is available.

Query:
  * resource: : string > Select type of results: products, categories, customers ...
  * display : string > Allows you to limit result fields to only those you need, by default it will return all fields
  * filter: string > field to filter by: id, name, category ...
  * filterArgs: string > value to filter by: '1', 'pc', 'tech' ...
  * sort: string > sort results by: 'id_ASC', 'id_DESC', 'name_ASC', 'name_DESC' ...
  * limit: string > limit number of results, or define range of results '5', '9,5'

Example
```typescript
import { Component } from '@angular/core';
import { PrestaService, Query } from 'angular2-presta';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PrestaService]
})
export class AppComponent {

  title = 'App title';
  items: any[];

  constructor(private _prestaService: PrestaService) {

    var query: Query = {
      resource : 'products',
      display  : 'id, id_default_image, name, price, description_short, condition',
      sort: 'name_ASC'
    };

    this._prestaService.get(query)
                       .subscribe(results => this.items = results);

  }

}
```

## Outputing data

Some of the Presta web service results come with html tags included to filter out tags you can use removeTags pipe.

```html
<ul *ngIf="items">
  <li *ngFor="let item of items">
    <h1>{{ item.name }}</h1>
    <p>{{ item.description_short | removeTags }}</p>
    <p>{{ item.price }}<p>
  </li>
</ul>
```

## License

MIT © [Samir Kahvedzic](mailto:akirapowered@gmail.com)
