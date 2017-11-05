import { Component } from '@angular/core';
import { NavController, ActionSheetController, ActionSheet, Loading, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {Login} from "../login/login";
import {OrderService} from "../../app/services/order.service";
import {ColorService} from "../../app/services/color.service";

const storage: Storage = new Storage();

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public orders: IOrder[] = [];
  public colors: IColorMarker[] = [];
  public date: Date = new Date();

  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController,
              private orderService: OrderService, private colorService: ColorService,
              private actionSheetController: ActionSheetController) {

  }

  public ionViewDidEnter() {
    this.loadData();
  }

  public loadData(refresher?): void {
    if (refresher) {
      this.orderService.getTodayOrders().subscribe(res => {
        this.orders = res;
        refresher.complete();
      });
      this.colorService.getAll().subscribe(colors => this.colors = colors);
    } else {
      if (!(this.orders && this.orders.length)) {
        const loading: Loading = this.loadingCtrl.create();
        loading.present();
        this.orderService.getTodayOrders().do(() => loading.dismiss()).subscribe(
          res => this.orders = res,
          () => loading.dismiss()
        );
      }
      if (!(this.colors && this.colors.length)) {
        this.colorService.getAll().subscribe(colors => this.colors = colors);
      }
    }
  }

  ionViewCanEnter(){
    storage.get('token').then((token: string) => {
      if (!token) {
        this.navCtrl.push(Login);
        return false;
      }
    });
  }

  toggleOrderVisibility(index: number): void {
    this.orders.filter((o, i) => i !== index).forEach(order => order.isVisible = false);
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
