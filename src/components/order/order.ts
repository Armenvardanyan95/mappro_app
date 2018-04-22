import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastController, LoadingController, Loading } from 'ionic-angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

import { OrderService } from '../../app/services/order.service';

@Component({
  selector: 'order',
  templateUrl: 'order.html',
  providers: [LaunchNavigator]
})
export class OrderComponent {

  @Input() order: IOrder;
  @Input() colors: IColorMarker[] = [];
  @Input() rank: number;
  @Output() onVisible: EventEmitter<boolean> = new EventEmitter();


  constructor(private orderService: OrderService, private toastCtrl: ToastController,
              private loadingCtrl: LoadingController, private navigator: LaunchNavigator) { }

  public makeRGBWithAlpha(hex: string): string {
    const rgb = this.hexToRgb(hex);
    const rgbString = `rgba(${rgb.r},${rgb.g},${rgb.b},0.5)`;
    return rgbString;
  }

  private hexToRgb(hex: string) {
    const result: RegExpExecArray = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  setColorsOnOptions() {
    setTimeout(() => {
      const optionsWrapper = document.body.querySelector('.alert-wrapper');
      const options = optionsWrapper.querySelectorAll('.alert-radio-label');
      for (let i = 0; i < options.length; i++) {
        (<HTMLButtonElement>options[i]).style.backgroundColor = this.colors[i].color;
      }
    }, 20);
  }

  changeOrderColor(order: IOrder): void {
    const loading: Loading = this.loadingCtrl.create();
    loading.present();
    this.orderService.changeOrderColor(order.id, order.colorMarkerDetails.id)
      .do(() => loading.dismiss())
      .subscribe(
        () => {
          this.showToast('Successfully changed color');
          order.colorMarkerDetails.color = this.colors
            .filter((color: IColorMarker) => color.id === order.colorMarkerDetails.id)
            .map((color: IColorMarker) => color.color)[0];
        },
        err => this.showToast('Error changing color')
      );
  }

  private showToast(message: string): void {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 10000,
      position: 'center'
    });
    toast.present();
  }

  toggleOrderVisibility(): void {
    this.order.isVisible = !this.order.isVisible;
    this.onVisible.emit(this.order.isVisible);
  }

  launchNavigator(): void {
    this.navigator.navigate(this.order.address);
  }

}
