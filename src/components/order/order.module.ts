import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { OrderComponent } from './order';

@NgModule({
  declarations: [
    OrderComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    OrderComponent
  ]
})
export class OrderModule {}
