import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from '../shared/services/app.service';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();

import { environment } from '../../environments/environment';

const LOGO_URL="/assets/resources/b14ucc-logo.png";
const THEMES_LOCATION="themes/";
const PRIMARY_COLOR="blue";
const PRIMARY_DARK_COLOR="blue";
const LDAP_SERVER="";
const ACTIVATION_METHOD="push";
const ACTIVATION_URL="http://lab2.kombicorp.com:8000/activate";
const STRIPE_AMOUNT="100";
const STRIPE_CURRENCY="USD";
const STRIPE_NAME="blabla";
const STRIPE_DESCRIPTION="blablabla";
const STRIPE_PUBLISHABLE_KEY="blablabla";
const RECAPTCHA_SITE_KEY="6LeDB58UAAAAAL8MlsVo5FnZSGg8FkYB4RJ0vCG1";
const ACKNOWLEDGEMENT="Powered by <a href='https://respondcms.com'>Respond 7</a>. Build fast, responsive sites with Respond CMS.";
const PRODUCT_FEATURE='enable';
const TOP_MENU_FEATURE='disable';

@Component({
    selector: 'respond-login',
    templateUrl: 'login.component.html',
    providers: [TranslateService, UserService, AppService]
})

export class LoginComponent {

  data;
  id;
  errorMessage;
  logoUrl
  usesLDAP = false;
  hasMultipleSites = false;
  defaultLanguage = 'en';
  acknowledgement;


  fake_news = {
    user : {
      language :'en',
      sysadmin: true,
      siteId: "blabla",
      role:'admin'
    },

    message : {
      color :'blue',
      text :'blablabla',
      link :'crm.kombicorp.com',
    },
    sync: {
      canSync: true
    },
    token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1NTU2ODM1NjMsImV4cCI6MTU4NzIxOTU2MywiYXVkIjoid3d3LmtvbWJpY29ycC5jb20iLCJzdWIiOiJncmVnbUBrb21iaWNvcnAuY29tIiwiZmlyc3RuYW1lIjoiR3JlZ29yeSIsImxhc3RuYW1lIjoiTWFjZSIsImVtYWlsIjoiZ3JlZ21Aa29tYmljb3JwLmNvbSIsIlJvbGUiOlsiTWFuYWdlciIsIlByb2plY3QgQWRtaW5pc3RyYXRvciJdLCJpZCI6IndlYjEifQ.HJ0OkXuixBwwG_vQct193AALCUS1pv0iCc28qpiSELI'

  }
//  token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1NTU2ODM1NjMsImV4cCI6MTU4NzIxOTU2MywiYXVkIjoid3d3LmtvbWJpY29ycC5jb20iLCJzdWIiOiJncmVnbUBrb21iaWNvcnAuY29tIiwiR2l2ZW5OYW1lIjoiR3JlZ29yeSIsIlN1cm5hbWUiOiJNYWNlIiwiZW1haWwiOiJncmVnbUBrb21iaWNvcnAuY29tIiwiUm9sZSI6WyJNYW5hZ2VyIiwiUHJvamVjdCBBZG1pbmlzdHJhdG9yIl19.e_sUUmZJJsXnG5j--R_SEEgbF_IHgnXkfJxRrRb7OfI'
//  token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1NTU2ODM1NjMsImV4cCI6MTU4NzIxOTU2MywiYXVkIjoid3d3LmtvbWJpY29ycC5jb20iLCJzdWIiOiJncmVnbUBrb21iaWNvcnAuY29tIiwiR2l2ZW5OYW1lIjoiR3JlZ29yeSIsIlN1cm5hbWUiOiJNYWNlIiwiRW1haWwiOiJncmVnbUBrb21iaWNvcnAuY29tIiwiUm9sZSI6WyJNYW5hZ2VyIiwiUHJvamVjdCBBZG1pbmlzdHJhdG9yIl19.BsEJGpKp2C2FgjkrVZhcWvuBKHu9SMp3unC5Zc0_NTo'

  fake_settings = {
      hasPasscode:true,
      defaultLanguage:'en',
      mode:'core',
      logoUrl:LOGO_URL,
      themesLocation:THEMES_LOCATION,
      primaryColor:PRIMARY_COLOR,
      primaryDarkColor:PRIMARY_DARK_COLOR,
      usesLDAP:LDAP_SERVER,
      activationMethod:ACTIVATION_METHOD,
      activationUrl:ACTIVATION_URL,
      stripeAmount:STRIPE_AMOUNT,
      stripeCurrency:STRIPE_CURRENCY,
      stripeName:STRIPE_NAME,
      stripeDescription:STRIPE_DESCRIPTION,
      stripePublishableKey:STRIPE_PUBLISHABLE_KEY,
      recaptchaSiteKey:RECAPTCHA_SITE_KEY,
      acknowledgement:ACKNOWLEDGEMENT,
      productFeature:PRODUCT_FEATURE,
      topMenuFeature:TOP_MENU_FEATURE

  }

  constructor (private _userService: UserService, private _appService: AppService, private _route: ActivatedRoute, private _router: Router, private _translate: TranslateService) {}

  ngOnInit() {

    this.logoUrl = '';
    this.acknowledgement = '';

      this._route.params.subscribe(params => {
        this.id = params['id'];
        localStorage.setItem('site_id', this.id);
      });

      // retrieve settings
      this.settings();
  }

  /**
   * Get settings
   */
  settings() {
    /*
    // gregm do fake news here!
    this.data = this.fake_settings;

    this.logoUrl = this.data.logoUrl;
    this.acknowledgement = this.data.acknowledgement;
    this.defaultLanguage = this.data.defaultLanguage;

    // set mode
    localStorage.setItem('respond_mode', this.data.mode);

    // set language
    this.setLanguage(this.defaultLanguage);

    // set features
    this.setFeatures(this.data);
    // set activation
    this.setActivation(this.data.activationMethod, this.data.activationUrl, this.data.stripeAmount, this.data.stripeName, this.data.stripeDescription, this.data.stripePublishableKey, this.data.stripeCurrency)
    */

    this._appService.retrieveSettings()
                     .subscribe(
                      (data: any) => {
                        console.log("login.retrieveSettings <= "+JSON.stringify(data));
                         this.logoUrl = data.logoUrl;
                         this.acknowledgement = data.acknowledgement;
                         this.defaultLanguage = data.defaultLanguage;

                         // set mode
                         localStorage.setItem('respond_mode', data.mode);

                         // set language
                         this.setLanguage(this.defaultLanguage);

                         // set features
                         this.setFeatures(data);

                         // set activation
                         this.setActivation(data.activationMethod, data.activationUrl, data.stripeAmount, data.stripeName, data.stripeDescription, data.stripePublishableKey, data.stripeCurrency)
                       },
                       error =>  { this.failure(<any>error); }
                      );

  }

  /**
   * Login to the app
   *
   * @param {Event} event
   * @param {string} email The user's login email
   * @param {string} password The user's login password
   * @param {string} test The user's site
   */
  login(event, email, password, site) {

      event.preventDefault();

      let id = undefined;

      if(this.id != undefined) {
        id = this.id;
      }

      if(site != '') {
        id = site;
      }

      // login
      // this.data = this.fake_news;
      // this.success();
      this._userService.login(id, email, password)
                   .subscribe(
                    (data: any) => {
                      console.log('login success : '+JSON.stringify(data));
                      // this.data = this.fake_news;
                      this.data = data;
                      this.success();
                    },
                     error => { this.failure(<any>error); }
                    );

  }

  /**
   * Handles a successful login
   */
  success() {

    // show the toast
    this._appService.showToast('success', null);

    // set language
    this.setLanguage(this.data.user.language);

    // set color
    localStorage.setItem('message_color', this.data.message.color);
    localStorage.setItem('message_text', this.data.message.text);
    localStorage.setItem('message_link', this.data.message.link);

    // set syncability
    localStorage.setItem('can_sync', this.data.sync.canSync);

    // set is sysadmin
    localStorage.setItem('is_sysadmin', this.data.user.sysadmin);

    // set token
    localStorage.setItem('id_token', this.data.token);

    // set site id
    localStorage.setItem('site_id', this.data.user.siteId);
    localStorage.setItem('site_role', this.data.user.role);

    // navigate
    this._router.navigate( ['/pages'] );

  }

  /**
   * Routes to the forgot password screen
   */
  forgot() {
    if(this.id != undefined) {
      this._router.navigate( ['/forgot', this.id] );
    }
    else {
      this._router.navigate( ['/forgot'] );
    }
  }

  /**
   * Routes to the create screen
   */
  create() {
    this._router.navigate( ['/create'] );
  }

  /**
   * Sets the language for the app
   */
  setLanguage(language) {
      localStorage.setItem('user_language', language);

      // set language
      this._translate.use(language);
  }

  /**
   * Sets the language for the app
   */
  setSites(sites, sysadmin) {
    localStorage.setItem('respond_sites', JSON.stringify(sites));
    localStorage.setItem('respond_sysadmin', JSON.stringify(sysadmin));
  }

  /**
   * Sets the status
   */
  setStatus(status, days, hasAccount) {

      // set
      let strHasAccount:string = 'false';

      // set expired
      if(status == 'Trial' && days < 0) {
        status = 'Expired';
      }

      // set has account
      if(hasAccount == true) {
        strHasAccount = 'true';
      }

      localStorage.setItem('site_status', status);
      localStorage.setItem('site_has_account', strHasAccount);
      localStorage.setItem('site_trial_days_remaining', days);
  }

  /**
   * Sets the activation
   */
  setActivation(activationMethod, activationUrl, stripeAmount, stripeName, stripeDescription, stripePublishableKey, stripeCurrency) {

      localStorage.setItem('activation_method', activationMethod);
      localStorage.setItem('activation_url', activationUrl);
      localStorage.setItem('stripe_amount', stripeAmount);
      localStorage.setItem('stripe_name', stripeName);
      localStorage.setItem('stripe_description', stripeDescription);
      localStorage.setItem('stripe_publishable_key', stripePublishableKey);
      localStorage.setItem('stripe_currency', stripeCurrency);

  }

  /**
   * Sets the features for the app
   */
  setFeatures(data: any) {

    localStorage.setItem('product_feature', data.productFeature);
    localStorage.setItem('top_menu_feature', data.topMenuFeature);
  }

  /**
   * handles error
   */
  failure(obj) {

    if(obj.status == 409) {
      this.hasMultipleSites = true;
    }

    // show the toast
    this._appService.showToast('failure', obj.error);

  }


}
