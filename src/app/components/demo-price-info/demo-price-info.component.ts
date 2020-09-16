import {Component, OnInit} from '@angular/core';
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-demo-price-info',
  templateUrl: './demo-price-info.component.html',
  styleUrls: ['./demo-price-info.component.scss']
})
export class DemoPriceInfoComponent implements OnInit {

  constructor(public commonService: CommonService) {
  }

  addressInfo: object;
  zillowInfo: object;
  floodInfo: object;

  ngOnInit() {
    this.addressInfo = this.commonService.getAddressData();
    this.zillowInfo = this.getInfo('zillow');
    this.floodInfo = this.getInfo('flood').data;
    console.log(this.floodInfo,'floodInfo');
  }

  getInfo(key) {
    const total_data = this.commonService.getLocalItem('total_data');
    if (total_data) return total_data[key];
    return {};
  }
}
