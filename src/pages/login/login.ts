import { Component } from '@angular/core';
import { Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import {AuthService} from "../../app/services/auth.service";
import {NavController, ToastController} from "ionic-angular";
import {HomePage} from "../home/home";

const storage: Storage = new Storage();

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {

  constructor(private authService: AuthService,
              private navCtrl: NavController, private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.authService.authChanged.emit(false);
  }

  private showToast(message: string): void {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 10000,
      position: 'center'
    });
    toast.present();
  }

  login(username: string, password: string) {
    this.authService.authenticate({username: username, password: password})
      .subscribe(
        (res: {token: string, isAdmin: boolean}) => {
          if (res.isAdmin) {
            this.showToast('Administrator users cannot access mobile application');
            return false;
          }
          storage.set('token', res.token).then(() => this.authService.authChanged.emit(true));
        },
        (err: Response) => {
          const errors = err.json()['non_field_errors'];
          this.showToast(errors[0]);
        }
      )
  }

}
