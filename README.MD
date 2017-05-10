![angular2-presta](https://imagizer.imageshack.us/v2/888x214q90/922/yZyztX.png)

# angular2-presta

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

import { AppComponent } from './app.component';

// Import angular2-presta module
import { PrestaModule, PrestaConfiguration, PrestaService } from 'angular2-presta';

// Add your presta web service api key and shop url
export const prestaConfiguration: PrestaConfiguration = {
  apiKey: 'YOUR_PRESTA_API_KEY',
  imageApiKey: 'YOUR_PRESTA_API_KEY', // ApiKey only with images GET permissions for security reasons
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
  // provide presta service as global
  providers: [PrestaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Using PrestaService

```typescript
import { Component } from '@angular/core';
import {Observable} from 'rxjs/Observable';

// Import presta service and Query
import { PrestaService, Query, ImageSize } from 'angular2-presta';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent {

  // store subscription to presta webservice so we can unsuscribe later
  subscription: any;

  // List of products
  products: Observable<any>;

  // construct query
  query: Query = {
    // define resource products, categories ...
    // check full list http://doc.prestashop.com/display/PS16/Web+service+reference
    resource : 'products',
    // return only fields you need
    display  : 'id,id_default_image,name,price,description_short,condition',
    // filter results
    filter: {
      name: 'blouse',
      condition: 'new'
    },
    // sort results
    sort: 'name_ASC',
    // limit number of results or define range
    limit: '1'
  };

  constructor(private _prestaService: PrestaService) {

    // pass Query to presta service and subscribe to get results
    this.subscription = this._prestaService.get(this.query)
                       .subscribe(results => this.products = results);

  }

  // don't forget to unsuscribe
  ngOnDestroy() {
    this.subscription.unsuscribe();
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
- imageSizes: **Object** <ImageSize> define image sizes using ImageSize enum for example ImageSize.small_default, ImageSize.large_default

### Get product categories

```typescript
query: Query = {
    resource: 'categories'
  };
```

### Get products by category

```typescript
query: Query = {
    resource: 'products',
    filter: {
      id_category_default: '11'
    }
  };
```

### Get product by id

```typescript
query: Query = {
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
query: Query = {
    search: 'blouse'
  };

this._prestaService.search(query)
                   .subscribe(results => this.items = results);
```

### Search categories

```typescript
query: Query = {
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

## Working with images

Before you try to use images you should generate one special API KEY, only with one permission to GET images. This is most secure method, because your API KEY will be included in every call to fetch image so it's easy to obtain it by third person.

Include your images API KEY into PrestaConfiguration object in AppModule:

```typescript
// Add your presta web service api key and shop url
export const prestaConfiguration: PrestaConfiguration = {
  apiKey: 'YOUR_PRESTA_API_KEY',
  imageApiKey: 'YOUR_PRESTA_API_KEY', // ApiKey only with images GET permissions for security reasons
  shopUrl: 'http://yourshop.com/api/'
}
```

Your component: We will get product with id of 1 and define image sizes we will use in our template using ImageSize enum values. For example we can use large size for products default image and small size for all other images.

```typescript
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PrestaService, Query, ImageSize } from 'angular2-presta';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent {

  product: Observable<any>;
  query: Query = {
    resource: 'products',
    filter: {
      id: '1'
    },
    imageSizes: {
        small: ImageSize.small_default,
        large: ImageSize.large_default
      }
  };

  constructor(private _prestaService: PrestaService) {

      this._prestaService.get(this.query)
                         .subscribe(results => this.product = results[0]);
    }
}
```

In your html template:

```html
<ul *ngIf="product">
  <li>
    <!-- use presta-img component to get products default image and display it as large image -->
    <presta-img [resource]="query.resource" [resourceID] ="product.id" [imageID]="product.id_default_image" [size]="query.imageSizes.large"></presta-img>
    <h1>{{ product.name }}</h1>
    <p>{{ product.description_short | removeTags  }}</p>
    <h3>{{ product.price | currency }}</h3>
    <!-- get all images for this product and use small image size -->
    <ul *ngIf="product.associations.images">
           <li *ngFor="let image of product.associations.images">
               <presta-img [resource]="query.resource" [resourceID]="product.id" [imageID]="image.id" [size]="query.imageSizes.small"></presta-img>
           </li>
       </ul>
  </li>
```

## Roadmap

- [x] GET requests, filtering, sorting
- [x] SEARCH support
- [x] IMAGES support
- [ ] POST requests
- [ ] UPDATE requests
- [ ] DELETE requests

## Latest updates

### v0.1.9
  - Upadated presta-img component for better image loading
  - presta-img now requires image size to be defined using ImageSize enum values to reduce errors
  - All packages updated
  - Better error catching
  - Tested with Prestashop 1.7

### v0.1.7
  - Fixed module exports
  - Documentation improved

### v0.1.6
  - Added images support by new PrestaImage component
  - Fixed limit not working

### v0.1.4 - v0.1.5
  - Updated documentation

### v0.1.3
  - Added support for search, code optimized, many fixes

### v0.1.2
  - Added support for more then one filter

## Aditional resources

- [Presta Shop web service: Documentation](http://doc.prestashop.com/display/PS16/Using+the+PrestaShop+Web+Service)
- [Presta Shop web service: Tutorial](http://doc.prestashop.com/display/PS16/Web+service+tutorial)
- [Presta Shop web service: Advanced usage](http://doc.prestashop.com/display/PS16/Chapter+8+-+Advanced+use)
- [Presta Shop web service: Image management](http://doc.prestashop.com/display/PS16/Chapter+9+-+Image+management)
- [Presta Shop web service: Reference](http://doc.prestashop.com/display/PS16/Web+service+reference)

## License

MIT © [Samir Kahvedzic](mailto:akirapowered@gmail.com)
