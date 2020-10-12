import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from "../services/common.service";
import * as $ from "jquery";

@Component({
  selector: 'app-issuing',
  templateUrl: './issuing.component.html',
  styleUrls: ['./issuing.component.scss']
})
export class IssuingComponent implements OnInit {

  insuranceOptions = {
    home: true,
    auto: false,
    flood: false,
    life: false,
    umbrella: false,
    condo: false
  }

  constructor(private commonService: CommonService) {
    $('body').on('click',function(event){

      if($("#jumbo-dropdown-menu").hasClass('fadeInDropdown') && !$(event.target).is('#jumbo-dropdown-menu') && !$(event.target).is('.jumbo-option *')){
        $("#jumbo-dropdown-menu").removeClass('fadeInDropdown');
        $(".dropdown").removeClass('open show');
        $(".dropdown-toggle").focus();
      }
    });
  }

  ngOnInit() {
    this.commonService.applyTotalData('insuranceOptions',this.insuranceOptions)
  }

  toggle(key) {
    this.insuranceOptions[key] = !this.insuranceOptions[key];
    this.commonService.applyTotalData('insuranceOptions',this.insuranceOptions)
  }
}
