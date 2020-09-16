import {Component, EventEmitter, OnInit} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {ApiService} from "../../services/api-service";

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
  }
  sendEmail($event){
    this.prices = $event;
    this.showModal.emit(true);
  }
}
