import {Component, OnInit, Input} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {PrestaService} from './presta.service';

@Component({
  selector: 'presta-img',
  template: `
    <img [src]="image" />
  `,
  providers: [PrestaService]
})
export class PrestaImage implements OnInit {

  @Input() resource: string;
  @Input() resourceID: number;
  @Input() imageID: number;
  @Input() size?: string;

  image: Observable<any>;

  constructor(private _prestaService: PrestaService) {}

  ngOnInit() {

    this._prestaService.getImage(this.resource, this.resourceID, this.imageID, this.size)
        .subscribe(result => this.image = result);

  }

}
