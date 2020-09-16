import { Component, OnInit } from '@angular/core';
import {CommonService} from "../../services/common.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-policy-start-date',
  templateUrl: './policy-start-date.component.html',
  styleUrls: ['./policy-start-date.component.scss']
})
export class PolicyStartDateComponent implements OnInit {
  public start_date:string;
  constructor(public commonService:CommonService, public router:Router) { }

  ngOnInit() {
  }
  next(){
    if(!this.start_date) return;
    const total_data = this.commonService.getLocalItem('total_data');
    let mortgage_data = total_data['mortgage_data'];
    if (!mortgage_data) mortgage_data = {};
    mortgage_data['startdate'] = this.start_date;
    this.commonService.applyTotalData('mortgage_data', mortgage_data);
    this.router.navigateByUrl('/policy-have-mortgage');
  }

}
