import { Component } from '@angular/core';
import { NavController, ActionSheet, ActionSheetController, Loading, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {Login} from "../login/login";
import { OrderService } from '../../app/services/order.service';
import { ColorService } from '../../app/services/color.service';
import 'rxjs/add/operator/switchMap';

const storage: Storage = new Storage();

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  colors: IColorMarker[] = [];
  dates: {date: any, orders: IOrder[], isVisible: boolean}[] = [];

  constructor(public navCtrl: NavController, private actionSheetController: ActionSheetController, private loadingCtrl: LoadingController,
              private colorService: ColorService, private orderService: OrderService) {

  }

  ionViewCanEnter(){
    storage.get('token').then((token: string) => {
      if (!token) {
        this.navCtrl.push(Login);
        this.navCtrl.remove(0);
        return false;
      }
    });
  }

  public ionViewDidEnter() {
    this.loadData();
  }

  public loadData(refresher?): void {
    if (refresher) {
      this.orderService.filterMyOrders().subscribe(res => {
        this.dates = res;
        refresher.complete();
      });
      this.colorService.getAll().subscribe(colors => this.colors = colors);
    } else {
      if (!(this.dates && this.dates.length)) {
        const loading: Loading = this.loadingCtrl.create();
        loading.present();
        this.orderService.filterMyOrders().do(() => loading.dismiss()).subscribe(
          res => this.dates = res,
          () => loading.dismiss()
        );
      }
      if (!(this.colors && this.colors.length)) {
        this.colorService.getAll().subscribe(colors => this.colors = colors);
      }
    }
  }

  toggleDateVisibility(index: number): void {
    for (let i = 0; i < this.dates.length; i++) {
      if (i !== index) {
        this.dates[i].isVisible = false;
      }
    }
    this.dates[index].isVisible = !this.dates[index].isVisible;
  }

  toggleOrderVisibility(index: number, jindex: number): void {
    this.dates[index].orders.filter((o, i) => i !== jindex).forEach(order => order.isVisible = false);
  }

  openPopoverMenu(): void {
    const actionSheet: ActionSheet =  this.actionSheetController.create({
      title: 'Settings',
      buttons: [
        {
          role: 'destructive',
          text: 'Logout',
          handler: () => {
            storage.remove('token').then(() => {
              this.navCtrl.goToRoot({});
            });
          }
        }
      ]
    });
    actionSheet.present();
  }

}
