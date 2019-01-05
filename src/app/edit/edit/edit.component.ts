import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { AppService } from '../../shared/services/app.service';

@Component({
    selector: 'respond-edit',
    templateUrl: 'edit.component.html',
    providers: [AppService]
})

export class EditComponent {

  url: SafeResourceUrl;
  drawerVisible: boolean = false;
  id: string;
  pageUrl: string;
  siteUrl: string;
  fullPageUrl: string;
  mode: string = 'page';

  // changed
  hasChanged: boolean = false;

  // visibles
  confirmVisible: boolean = false;
  editImageVisible: boolean = false;
  editLinkVisible: boolean = false;
  addBlockVisible: boolean = false;
  editMenuVisible: boolean = false;
  editElementVisible: boolean = false;
  editBlockVisible: boolean = false;

  // type
  type: string;

  element: any = {
    properties: {},
    attributes: {}
  }

  block: any = {
    properties: {},
    attributes: {}
  }

  link: any = {
    properties: {},
    attributes: {}
  }

  image: any = {
    properties: {},
    attributes: {}
  }

  @ViewChild('editFrame') el: ElementRef;

  constructor (private _sanitizer: DomSanitizer, private _appService: AppService, private _router: Router,  private _route: ActivatedRoute) {
    // (<any>window).configurePlugin = this.configurePlugin.bind(this);
  }

  /**
   * Init pages
   *
   */
  ngOnInit() {

    var editMode, fullPageUrl;

    this.id = localStorage.getItem('site_id');
    this.pageUrl = localStorage.getItem('page_url');
    
    this._route.params.subscribe(params => {
      this.mode = params['mode'];
      this.url = this._sanitizer.bypassSecurityTrustResourceUrl('/edit?q=' + this.id + '/' + this.pageUrl + '&mode=' + this.mode);
    });

    this.buildUrl();
  }

  /**
   * Get the url for the page
   */
  buildUrl() {
    
        // retrieve settings
        this._appService.retrieveSettings()
                         .subscribe(
                          (data: any) => {
                              this.siteUrl = data.siteUrl;
                              this.siteUrl = this.siteUrl.replace('{{siteId}}', this.id);
                              this.fullPageUrl = this.siteUrl + '/' + this.pageUrl;
                           },
                           error =>  { }
                          );
      }

  /**
   * Resets an modal booleans
   */
  reset() {
    this.drawerVisible = false;
    this.confirmVisible = false;
    this.editImageVisible = false;
    this.editLinkVisible = false;
    this.addBlockVisible = false;
    this.editMenuVisible = false;
    this.editElementVisible = false;
    this.editBlockVisible = false;
  }

  /**
   * navigates back
   */
  back() {

    if(this.hasChanged == true) {
      this.confirmVisible = true;
    }
    else {
      this.continueNavigation();
    }
  }

  /**
   * Calls save in the editor
   */
  save() {

    // show menu in the editor
    this.el.nativeElement.contentWindow.editor.save();
    this.hasChanged = false;

    this._appService.showToast('success', null);

  }

  /**
   * Calls save in the editor
   */
  publish() {

    // show menu in the editor
    this.el.nativeElement.contentWindow.editor.publish();
    this.hasChanged = false;

    this._appService.showToast('success', null);

  }

  /**
   * Calls save in the editor
   */
  update(obj) {

    if(obj.type != 'element' && obj.type != 'block') {
      this.reset();
    }

    // show menu in the editor
    this.el.nativeElement.contentWindow.editor.update(obj)

  }

  /**
   * Calls sendCommand in the editor
   */
  sendCommand(command) {
    // show menu in the editor
    this.el.nativeElement.contentWindow.editor.execCommand(command);

    if(command == 'element.remove' || command == 'block.remove') {
      this.reset();
    }

  }

  /**
   * Calls save in the editor
   */
  addBlock(obj) {

    // add type
    obj.type = 'add-block';

    // show menu in the editor
    this.el.nativeElement.contentWindow.editor.update(obj)

    // reset
    this.reset();
    
  }

  /**
   * Shows the drawer
   */
  toggleDrawer() {
    this.drawerVisible = !this.drawerVisible;
  }

  /**
   * Shows the add menu
   */
  showAdd() {

    this.reset();

    // show menu in the editor
    this.el.nativeElement.contentWindow.editor.showMenu();

  }

  /**
   * Shows the page
   */
  showPage() {
    window.open(this.fullPageUrl, '_blank');
  }

  showAddBlock() {
    this.addBlockVisible = true;
  }

  /**
   * Navigates to the focused mode
   */
  showFocused() {
    
    if(this.mode == 'page') {
      var id = Math.random().toString(36).substr(2, 9);
      this._router.navigate( ['/edit',  id, 'focused'] );
    }
    else {
      var id = Math.random().toString(36).substr(2, 9);
      this._router.navigate( ['/edit',  id, 'page'] );
    }

  }

  /**
   * Cancels navigation
   */
  cancelNavigation() {
    this.confirmVisible = false;
    return true;
  }

  /**
   * Continues navigation
   */
  continueNavigation() {
    this.confirmVisible = false;
    history.go(-1);
  }

  @HostListener("window:message",["$event"])
  configurePlugin($event:MessageEvent) {

    let data = $event.data;

    // look for element in message
    if(data.type && data.properties) {



      // show the appropriate modal
      if(data.type == 'image') {
        this.type = 'image';
        this.image.properties = data.properties;
        this.editImageVisible = true;
      }
      else if(data.type == 'link') {
        this.type = 'link';
        this.link.properties = data.properties;
        this.editLinkVisible = true;
      }
      else if(data.type == 'block') {
        this.type = 'block';
        this.block.properties = data.properties;
        this.editMenuVisible = true;
        this.editBlockVisible = true;
      }
      else if(data.type == 'element'){
        this.type = 'element';
        this.element.properties = data.properties;
        
        if(data.attributes != null && data.attributes != undefined) {
          this.element.attributes = data.attributes;
        }
        this.editMenuVisible = true;
        this.editElementVisible = true;
      }
      else if(data.type == 'editorChanged') {
        this.hasChanged = true;
        console.log('[respond] set this.hasChanged=true');
      }
      
    }
    
  }
  


}