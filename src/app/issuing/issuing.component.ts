import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from "../services/common.service";

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

  constructor(private commonService:CommonService) {
  }

  ngOnInit() {
    this.commonService.applyTotalData('insuranceOptions',this.insuranceOptions)
  }

  toggle(key) {
    this.insuranceOptions[key] = !this.insuranceOptions[key];
    this.commonService.applyTotalData('insuranceOptions',this.insuranceOptions)
  }
}
