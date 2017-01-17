# angular2-presta

This is beta version, with many bugs and missing features, only for testing ...

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
