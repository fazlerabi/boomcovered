import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-price-widget',
  templateUrl: './price-widget.component.html',
  styleUrls: ['./price-widget.component.scss']
})
export class PriceWidgetComponent implements OnInit {
  @Input('imgURL') public imgURL: string;
  @Input('price') public price: number;
  @Input('dwelling') public dwelling: string;
  @Output('openModal') public openPriceModal: EventEmitter<any> = new EventEmitter<any>();

  constructor(public commonService: CommonService) {

  }

  ngOnInit() {

  }

  openModal() {
    this.openPriceModal.emit();
  }
}
