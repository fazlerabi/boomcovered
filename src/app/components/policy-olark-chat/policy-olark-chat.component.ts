import {AfterViewInit, Component, OnInit} from '@angular/core';
import {OlarkService} from "../../services/olark.service";
import {Router} from "@angular/router";
import {LocalStorageService} from "angular-web-storage";
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-policy-olark-chat',
  templateUrl: './policy-olark-chat.component.html',
  styleUrls: ['./policy-olark-chat.component.scss']
})
export class PolicyOlarkChatComponent implements OnInit, AfterViewInit {
  showChat:boolean = false;
  chatPricing:number;
  chatType:number;
  imgURL:string;
  constructor(
    private olark: OlarkService,
    public  router: Router,
    public commonService: CommonService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // @ts-ignore
    this.setUpOlark();
  }

  async showChatWidget() {
    if (this.commonService.isMobileMode()) {
      this.olark.show();
    } else {
      const total_data = this.commonService.getLocalItem('total_data');
      this.showChat = true;
      this.imgURL = total_data['mortgage_data']['imgURL'];
      this.chatPricing = total_data['mortgage_data']['price'];
      await this.olark.load(window, document, "static.olark.com/jsclient/loader.js");
      this.olark.identify('4797-648-10-9515');
      setTimeout(() => {
        document.querySelector('.chat-container').scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        });
      })
    }
  }
  async setUpOlark() {
    await this.olark.load(window, document, "static.olark.com/jsclient/loader.js");
    this.olark.identify('4797-648-10-9515');
    this.showChatWidget();
  };
}
