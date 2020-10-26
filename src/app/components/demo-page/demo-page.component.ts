import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from "@angular/core";
import { CommonService } from "../../services/common.service";
import { ApiService } from "../../services/api-service";
import * as $ from "jquery";
import { Router } from "@angular/router";
import { DemoPageEmailModalComponent } from "./../demo-page-email-modal/demo-page-email-modal.component";

@Component({
  selector: "app-demo-page",
  templateUrl: "./demo-page.component.html",
  styleUrls: ["./demo-page.component.scss"],
})
export class DemoPageComponent implements OnInit {
  @ViewChild(DemoPageEmailModalComponent, { static: false })
  public sendPdf: DemoPageEmailModalComponent;

  constructor(public commonService: CommonService, public apiService: ApiService, private router: Router) {}
  showModal: EventEmitter<boolean> = new EventEmitter();
  prices: any;
  ngOnInit() {
    $(window).scroll(function () {
      let docViewTop = $(window).scrollTop();
      let docViewBottom = docViewTop + $(window).height();

      // let elem = $("app-demo-price-swiper");
      // let elemTop = $(elem).offset().top;
      // let elemBottom = elemTop + $(elem).height();

      // if ((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) {
      //   if ($(".fixed-continue").hasClass("fixed")) {
      //     $(".fixed-continue").removeClass("fixed");
      //   }
      // } else {
      //   $(".fixed-continue").addClass("fixed");
      // }
    });
  }

  sendEmail($event) {
    this.prices = $event;
    this.showModal.emit(true);
  }

  downloadPdf($event) {
    this.prices = $event;
    this.sendPdf.sendDemoEmailFunc(true, this.prices);
  }
  async goToThreeStep() {
    const total_data = this.commonService.getLocalItem("total_data");
    // total_data['mode'] = this.selectedMode;
    total_data["mode"] = 0;
    this.commonService.setLocalItem("total_data", total_data);
    this.router.navigate(["/step3"]);
  }
}
