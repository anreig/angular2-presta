import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrestaImage } from './presta-image.component';
import { RemoveTags } from './remove-tags.pipe';
import { PrestaService } from './presta.service';
import { PrestaConfiguration } from './presta.interfaces';

export * from './presta-image.component';
export * from './remove-tags.pipe';
export * from './presta.service';
export * from './presta.interfaces';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PrestaImage,
    RemoveTags
  ],
  exports: [
    PrestaImage,
    RemoveTags
  ]
})
export class PrestaModule {
  static forRoot(prestaConfiguration: PrestaConfiguration): ModuleWithProviders {
    return {
      ngModule: PrestaModule,
      providers: [
        PrestaService,
        {provide: 'prestaConfiguration', useValue: prestaConfiguration}
      ]
    };
  }
}
