import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ThemeService } from '../shared/services/theme.service';
import { AppService } from '../shared/services/app.service';

@Component({
    selector: 'respond-theme',
    templateUrl: 'theme.component.html',
    providers: [ThemeService, AppService]
})

export class ThemeComponent {

  id: string;
  role: string;
  url: SafeResourceUrl;
  drawerVisible: boolean;
  selectImgVisible: boolean = false;
  selectImgControlTargetId: string = null;

  siteUrl: string;

  settings: any = [];

  constructor (private _themeService: ThemeService, private _sanitizer: DomSanitizer, private _router: Router, private _appService: AppService) {}

  /**
   * Init
   *
   */
  ngOnInit() {

    this.id = localStorage.getItem('site_id');
    this.role = localStorage.getItem('site_role');

    this.load();
    this.list('load');

  }

  /**
   * Load page
   */
  load() {

    // retrieve settings
    this._appService.retrieveSettings()
                     .subscribe(
                      (data: any) => {
                         this.siteUrl = data.siteUrl;
                         this.siteUrl = this.siteUrl.replace('{{siteId}}', this.id);
                         this.siteUrl += '/index.html?' + Date.now();

                        console.log('loading=' + this.siteUrl);

                         this.url = this._sanitizer.bypassSecurityTrustResourceUrl(this.siteUrl);
                       },
                       error =>  { }
                      );
  }

  /**
   * Updates the list
   */
  list(source) {

    if(source != 'load') {
      this._appService.showToast('success', null);
    }

    this._themeService.list()
                     .subscribe(
                      (data: any) => { this.settings = data; },
                       error =>  { this.failure(<any>error); }
                      );

  }

  /**
   * handles the save command
   */
  save () {
    var data = this.settings;

    this._themeService.edit(data)
                     .subscribe(
                      (data: any) => { this.success(); this.list('save'); this.load(); },
                       error =>  { this.failure(<any>error); }
                      );

  }

  reset() {
    this.selectImgVisible = false;
  }

  /**
   * Handles success
   */
  success() {
    this._appService.showToast('success', null);
  }

  /**

  /**
   * Shows the drawer
   */
  toggleDrawer() {
    this.drawerVisible = !this.drawerVisible;
  }

  showImgSelect(id: string) {
    this.selectImgVisible = true;
    this.selectImgControlTargetId = id;
  }

  /**
   * image selected
   */
  imgSelected(event) {
    // copy selected image to customizations model
    const itemKey = Object.keys(this.settings.customizations).find(k => this.settings.customizations[k].id === this.selectImgControlTargetId);
    this.settings.customizations[itemKey].value = event.url;

    this.reset();
  }

  /**
   * handles errors
   */
  failure(obj) {

    this._appService.showToast('failure', obj.error);

    if(obj.status == 401) {
      this._router.navigate( ['/login'] );
    } else {
      this.reset();
    }

  }


}
