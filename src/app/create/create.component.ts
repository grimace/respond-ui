import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SiteService } from '../shared/services/site.service';
import { AppService } from '../shared/services/app.service';
import { ElementRef, ViewChild } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

declare var grecaptcha: any;

@Component({
    selector: 'respond-create',
    templateUrl: 'create.component.html',
    providers: [SiteService, AppService]
})

export class CreateComponent {

  themes;
  visible;
  selectedTheme;
  passedTheme: string = null;
  selectedThemeIndex;
  hasPasscode;
  logoUrl;
  themesLocation;
  model;
  site;
  recaptchaSiteKey;
  recaptchaResponse;
  acknowledgement;
  defaultLanguage: any;
  url: SafeResourceUrl;

  @ViewChild('container') container: ElementRef;

  constructor (private _sanitizer: DomSanitizer, private _siteService: SiteService, private _appService: AppService, private _router: Router,  private _route: ActivatedRoute, private _translate: TranslateService) {
    window['verifyCallback'] = this.verifyCallback.bind(this);
    window['onloadCallback'] = this.onloadCallback.bind(this)
  }

  /**
   * Init pages
   */
  ngOnInit() {

    // init
    this.themes = [];
    this.visible = false;
    this.passedTheme = null;
    this.selectedTheme = null;
    this.selectedThemeIndex = 0;
    this.hasPasscode = true;
    this.logoUrl = '';
    this.themesLocation = '';
    this.recaptchaSiteKey = '';
    this.recaptchaResponse = '';
    this.acknowledgement = '';

    // set model
    this.model = {
      name: '',
      theme: '',
      email: '',
      password: '',
      passcode: ''
    };

    // retrieve settings
    this.settings();

    if(this._route.snapshot.queryParamMap.get('theme')) {
      this.passedTheme = this._route.snapshot.queryParamMap.get('theme');
    }

    // list themes
    this.list();

  }

  /**
   * Create the site
   *
   */
  submit() {

      this._siteService.create(this.model.name, this.selectedTheme.location, this.model.email, this.model.password, this.model.passcode, this.recaptchaResponse)
                   .subscribe(
                    (data: any) => { this.site = data; this.success(); },
                     error =>  { this.failure(<any>error); }
                    );

  }

  /**
   * Get settings
   */
  settings() {

    // list themes in the app
    this._appService.retrieveSettings()
                     .subscribe(
                      (data: any) => {
                         console.log('_appService.retrieveSettings : '+data);
                         this.hasPasscode = data.hasPasscode;
                         this.logoUrl = data.logoUrl;
                         this.acknowledgement = data.acknowledgement;
                         this.themesLocation = data.themesLocation;
                         this.recaptchaSiteKey = data.recaptchaSiteKey;
                         this.defaultLanguage = data.defaultLanguage;
                         this.setLanguage(this.defaultLanguage);
                       },
                       error =>  { this.failure(<any>error); }
                      );


  }

  /**
   * Updates the list
   */
  list() {

    var context = this;

    // list themes in the app
    this._appService.listThemes()
                     .subscribe(
                      (data: any) => {

                         let index = 0;

                         this.themes = data;
                         this.visible = false;

                         // set passed theme
                         if(this.passedTheme != null) {

                          for(var x=0; x<this.themes.length; x++) {
                            if(this.themes[x].name.toLowerCase() == this.passedTheme.toLowerCase()) {
                              index = x;
                            }
                          }

                          this.visible = true;

                         }

                         // set selected index
                         this.selectedTheme = this.themes[index];
                         this.selectedThemeIndex = index;
                         this.url = this._sanitizer.bypassSecurityTrustResourceUrl('themes' + this.selectedTheme.location);
                       },
                       error =>  { this.failure(<any>error); }
                      );
  }

  /**
   * Cycles through themes
   */
  next () {

    // increment or cycle
    if((this.selectedThemeIndex + 1) < this.themes.length) {
      this.selectedThemeIndex = this.selectedThemeIndex + 1;
    }
    else {
      this.selectedThemeIndex = 0;
    }

    // set new theme
    this.selectedTheme = this.themes[this.selectedThemeIndex];
    this.url = this._sanitizer.bypassSecurityTrustResourceUrl('themes' + this.selectedTheme.location);

  }

  /**
   * Selects a theme
   */
  select (index) {

    this.selectedThemeIndex = index;
    this.selectedTheme = this.themes[this.selectedThemeIndex];
    this.url = this._sanitizer.bypassSecurityTrustResourceUrl('themes' + this.selectedTheme.location);



    window.scrollTo(0, 0);
  }


  /**
   * Uses the selected theme
   */
  useTheme () {

    // set new theme
    this.visible = true;

  }

  /**
   * Hides the create modal
   */
  hide () {

    // set new theme
    this.visible = false;

  }

  /**
   * Handles a successful create
   *
   */
  success() {

    this._appService.showToast('success', 'Site created successfully!');

    this._router.navigate( ['/login', this.site.id] );

    // clear model
    this.model = {
      name: '',
      theme: '',
      email: '',
      password: '',
      passcode: ''
    };

  }

  /**
   * handles errors
   */
  failure(obj) {
    this._appService.showToast('failure', obj.error);
  }

  /**
   * Verifies the reCAPTCHA response
   */
  verifyCallback(response){
    this.recaptchaResponse = response;
  }

  /**
   * Called when the reCAPTCHA JS loads
   */
  onloadCallback(response){

    var context = this,
        el = this.container.nativeElement;

    setTimeout(function() {
      context.setupRecaptcha(el);
    }, 1000);

  }

  /**
   * Setup the Recaptcha
   */
  setupRecaptcha(el) {

    if(this.recaptchaSiteKey != '') {
      grecaptcha.render(el, {
        'sitekey' : this.recaptchaSiteKey,
        'callback' : 'verifyCallback'
      });
    }

  }

  /**
   * Sets the language for the app
   */
  setLanguage(language) {

      localStorage.setItem('user_language', language);

      // set language
      this._translate.use(language);
  }

}
