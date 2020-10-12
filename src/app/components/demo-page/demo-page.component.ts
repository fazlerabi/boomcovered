import {Component, EventEmitter, OnInit} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {ApiService} from "../../services/api-service";
import * as $ from "jquery";

@Component({
  selector: 'app-demo-page',
  templateUrl: './demo-page.component.html',
  styleUrls: ['./demo-page.component.scss']
})
export class DemoPageComponent implements OnInit {

  constructor(public commonService:CommonService, public apiService:ApiService) { }
  showModal: EventEmitter<boolean> = new EventEmitter();
  prices:any;
  ngOnInit() {
    $(window).scroll(function() {
      let docViewTop = $(window).scrollTop();
      let docViewBottom = docViewTop + $(window).height();

      let elem = $("app-demo-price-swiper");
      let elemTop = $(elem).offset().top;
      let elemBottom = elemTop + $(elem).height();

      if ((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) {
        if ($(".fixed-continue").hasClass("fixed")) {
          $(".fixed-continue").removeClass("fixed");
        }
      } else {
        $(".fixed-continue").addClass("fixed");
      }
    });
  }

  sendEmail($event){
    this.prices = $event;
    this.showModal.emit(true);
  }
}
