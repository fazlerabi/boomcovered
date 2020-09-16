import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import * as $ from "jquery";
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-demo-price-header',
  templateUrl: './demo-price-header.component.html',
  styleUrls: ['./demo-price-header.component.scss']
})
export class DemoPriceHeaderComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(public commonService: CommonService) {
  }

  showLoader: boolean = true;
  lat: number;
  lng: number;
  highest_price: number;
  lowest_price: number;
  medium_price: number;
  @Output('sendEmail') sendEmail: EventEmitter<any> = new EventEmitter<any>()
  interval: any;

  ngOnInit() {
    $(document).ready(function(){
      $(window).scroll(function() {
        var windowBottom = $(this).scrollTop() + $(this).innerHeight();
          $(".bottomImageContainer").each(function() {
              /* Check the location of each desired element */
              var objectBottom = $(this).offset().top + $(this).outerHeight();
              /* If the element is completely within bounds of the window, fade it in */
              if (objectBottom < windowBottom) { //object comes into view (scrolling down)
                  if ($(this).css("opacity")==0) {
                      $(this).fadeTo(100,1, function() {
                          $(this).addClass('bounce');
                      });
                  }
              } else { //object goes out of view (scrolling up)
                  if ($(this).css("opacity")==1) {$(this).fadeTo(100,0);};
                  $(this).removeClass('bounce');
              }
            });
          }).scroll(); //invoke scroll-handler on page-load
        }
    );

    let mode;
    const total_data = this.commonService.getLocalItem('total_data');
    mode = total_data['mode'];
    if (!mode) mode = 0;
    mode = 0;
    this.generateMapData();
    this.interval = setInterval(() => this.getPricing(mode), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.interval)
  }

  generateMapData() {
    try {
      const total_data = this.commonService.getLocalItem('total_data');
      this.lat = total_data.address_components.geometry.location.lat;
      this.lng = total_data.address_components.geometry.location.lng;
    } catch (e) {
      this.lat = 0;
      this.lng = 0;
    }
  }

  getPricing(type) {
    const prices = this.commonService.getPricingForDemo(type);
    this.highest_price = prices['highest_price'];
    this.lowest_price = prices['lowest_price'];
    this.medium_price = prices['medium_price'];
    this.showLoader = false;
  }

  send() {
    const {highest_price, lowest_price, medium_price} = this;
    this.sendEmail.emit({highest_price, lowest_price, medium_price})
  }

  ngAfterViewInit(): void {

  }
}
