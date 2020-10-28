import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorageService } from "angular-web-storage";
import { CommonService } from "../services/common.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import * as $ from "jquery";
import { Subscription } from "rxjs";

@Component({
  selector: "app-property-form",
  templateUrl: "./property-form.component.html",
  styleUrls: ["./property-form.component.scss"],
})
export class PropertyFormComponent implements OnInit {
  constructionType: number;
  foundationType: number;
  isBasement: number;
  buildingType: number;
  square: number;
  built_year: number;
  ac_year: number;
  electric_year: number;
  plumbing_year: number;
  roof_year: number;
  roof_status: string;
  staticAddress: string;
  roof_type: number;
  exterior_type: number;
  progress = 25;
  currentTab = "Tab1";
  sliderCurrentIndex = 0;
  cards = [];
  personData = [
    {
      first_name: "",
      last_name: "",
      birthday: "1995-02-14",
    },
  ];
  //, birthday: ''}];
  email: string = "";
  phone: string = "";
  userForm: FormGroup;
  highPrice: number;
  lowPrice: number;

  isForward: boolean;

  sliderCards = [
    {
      title: "Asphalt shingle",
      description: "",
      img: "../../assets/images/roofs/asphalt-shingle.png",
    },
    {
      title: "Wood shingle",
      description: "",
      img: "../../assets/images/roofs/wood%20shingle.png",
    },
    {
      title: "Slate roof",
      description: "",
      img: "../../assets/images/roofs/slate%20roof.png",
    },
    {
      title: "Rubber",
      description: "",
      img: "../../assets/images/roofs/rubber.png",
    },
    {
      title: "Concrete Tile",
      description: "",
      img: "../../assets/images/roofs/concrete%20tile.png",
    },
    {
      title: "Solar",
      description: "",
      img: "../../assets/images/roofs/solar.png",
    },
    {
      title: "Tile roof",
      description: "",
      img: "../../assets/images/roofs/tile%20roof.png",
    },
    {
      title: "Tar and Gravel",
      description: "",
      img: "../../assets/images/roofs/tar%20and%20gravel.png",
    },
    {
      title: "Composition Shingle",
      description: "",
      img: "../../assets/images/roofs/compostion%20shingle.png",
    },
  ];
  slides: any = [[]];
  chunk(arr, chunkSize) {
    let R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }

  clickEventsubscription: Subscription;

  constructor(public router: Router, public local: LocalStorageService, public commonService: CommonService) {
    this.clickEventsubscription = this.commonService.getClickEvent().subscribe((isForward) => {
      this.isForward = isForward;
      this.moveTab(this.isForward);
    });
  }

  lat: number;
  lng: number;

  async ngOnInit() {
    let data = await this.commonService.getLocalItem("total_data");
    this.staticAddress = data["static_address"];
    console.log(data["zillow"]);
    this.built_year = data["zillow"]["built_year"];
    this.square = data["zillow"]["square"];
    this.generateMapData();
    this.slides = this.chunk(this.sliderCards, 4);
    this.cards = this.slides[this.sliderCurrentIndex];
    this.loadValue();
    $(".footerFlag").addClass("d-none");
  }

  async loadValue() {
    let data = await this.commonService.getLocalItem("total_data");
    data["construction_type"] == undefined ? this.constructionType : (this.constructionType = data["construction_type"]);
    data["foundation_type"] == undefined ? this.foundationType : (this.foundationType = data["foundation_type"]);
    data["square"] == undefined ? (this.square = data["zillow"]["square"]) : (this.square = data["square"]);
    data["built_year"] == undefined ? (this.built_year = data["zillow"]["built_year"]) : (this.built_year = data["built_year"]);
    data["is_basement"] == undefined ? this.isBasement : (this.isBasement = data["is_basement"]);
    data["ac_year"] == undefined ? this.ac_year : (this.ac_year = data["ac_year"]);
    data["building_type"] == undefined ? this.buildingType : (this.buildingType = data["building_type"]);
    data["electric_year"] == undefined ? this.electric_year : (this.electric_year = data["electric_year"]);
    data["plumbing_year"] == undefined ? this.plumbing_year : (this.plumbing_year = data["plumbing_year"]);
    data["roof_status"] == undefined ? this.roof_status : (this.roof_status = data["roof_status"]);
    data["roof_year"] == undefined ? this.roof_year : (this.roof_year = data["roof_year"]);
  }

  generateMapData() {
    try {
      const total_data = this.commonService.getLocalItem("total_data");
      this.lat = total_data.address_components.geometry.location.lat;
      this.lng = total_data.address_components.geometry.location.lng;
    } catch (e) {
      this.lat = 0;
      this.lng = 0;
    }
  }

  slide(isLeft: boolean) {
    if (isLeft) {
      if (this.sliderCurrentIndex > 0) {
        this.sliderCurrentIndex--;
        this.cards = this.slides[this.sliderCurrentIndex];
      }
    } else {
      if (this.sliderCurrentIndex < this.cards.length - 1) this.sliderCurrentIndex++;
      this.cards = this.slides[this.sliderCurrentIndex];
    }
  }

  async moveTab(isForward: boolean) {
    console.log("ere");
    switch (this.currentTab) {
      case "Tab1": {
        if (isForward) {
          if (this.validateAllInputs(false)) {
            this.currentTab = "Tab2";
            this.progress += 25;
          }
        }
        break;
      }
      case "Tab2": {
        if (isForward) {
          if (this.validateAllInputs(false)) {
            this.currentTab = "Tab3";
            this.progress += 25;
          }
        } else {
          this.currentTab = "Tab1";
          this.progress -= 25;
        }
        break;
      }
      case "Tab3": {
        if (isForward) {
          if (this.validateAllInputs(false)) {
            this.validateUserForm();
            let data = await this.commonService.getLocalItem("total_data");
            if (data["personData"] != undefined) {
              this.personData = data["personData"];
            }
            this.email = data["email"];
            this.phone = data["phone"] != undefined ? data["phone"].replace(/-/g, "") : "";
            this.calcPriceRange(data);
            this.currentTab = "Tab4";
            this.progress += 25;
          }
        } else {
          this.currentTab = "Tab2";
          this.progress -= 25;
        }
        break;
      }
      case "Tab4": {
        if (!isForward) {
          this.currentTab = "Tab3";
          this.progress -= 25;
        } else {
          if (this.validateAllInputs(false)) {
            this.currentTab = "Tab5";
          }
        }
        break;
      }

      case "Tab5": {
        if (!isForward) {
          this.currentTab = "Tab4";
        }
        break;
      }

      default:
        break;
    }
  }

  validateAllInputs(rtCheck: boolean) {
    switch (this.currentTab) {
      case "Tab1":
        if (this.built_year == undefined) {
          if (!rtCheck) this.commonService.modalOpen("Error", "Please type the correct built year.");
          return false;
        }
        if (!(this.square > 0)) {
          if (!rtCheck) this.commonService.modalOpen("Error", "Please type the correct square footage.");
          return false;
        }
        if (!(this.constructionType > 0)) {
          if (!rtCheck) this.commonService.modalOpen("Error", "Please type the correct construction type.");
          return false;
        }
        if (!(this.foundationType > 0)) {
          if (!rtCheck) this.commonService.modalOpen("Error", "Please type the correct foundation type.");
          return false;
        }
        break;

      case "Tab2": {
        if (this.isBasement == undefined) {
          if (!rtCheck) this.commonService.modalOpen("Error", "Please type the correct basement.");
          return false;
        }
        if (!(this.ac_year > 0)) {
          if (!rtCheck) this.commonService.modalOpen("Error", "Please type the correct A/C year.");
          return false;
        }
        if (!(this.electric_year > 0)) {
          if (!rtCheck) this.commonService.modalOpen("Error", "Please type the correct electric year.");
          return false;
        }
        if (!(this.plumbing_year > 0)) {
          if (!rtCheck) this.commonService.modalOpen("Error", "Please type the correct plumbing year.");
          return false;
        }
        if (!(this.roof_year > 0)) {
          if (!rtCheck) this.commonService.modalOpen("Error", "Please type the correct roof year.");
          return false;
        }
        if (this.roof_type == undefined) {
          this.commonService.modalOpen("Error", "Please type the correct roof type.");
          return false;
        }
        break;
      }

      case "Tab3": {
        if (this.exterior_type == undefined) {
          this.commonService.modalOpen("Error", "Please type the correct exterior type.");
          return false;
        }
        break;
      }
      case "Tab4": {
        this.submitUserData();
        break;
      }
    }
    return true;
  }

  validateUserForm() {
    let formData = {
      emailInput: new FormControl(this.email, [Validators.required]),
      // Validators.pattern(
      // /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      phoneInput: new FormControl(this.phone, [Validators.required]), // Validators.pattern(/^(\()?\d{3}(\))?(|\s)?\d{3}(|\s)\d{4}$/)]),
      firstnameInput: new FormControl(this.personData[0].first_name, [Validators.required]),
      lastnameInput: new FormControl(this.personData[0].last_name, [Validators.required]),
    };
    this.userForm = new FormGroup(formData);
  }

  formatPhoneNumber(phoneNumberString) {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return match[1] + "-" + match[2] + "-" + match[3];
    }
    return null;
  }

  async submitUserData() {
    if (this.userForm.invalid) {
      this.commonService.modalOpen("Error", "Please complete all required fields.");
      return;
    }
    this.commonService.spinnerService.show();
    let total_data = await this.commonService.getLocalItem("total_data");
    total_data["construction_type"] = this.constructionType;
    total_data["foundation_type"] = this.foundationType;
    total_data["square"] = this.square;
    total_data["built_year"] = this.built_year;
    total_data["ac_year"] = this.ac_year;
    total_data["electric_year"] = this.electric_year;
    total_data["plumbing_year"] = this.plumbing_year;
    total_data["roof_year"] = this.roof_year;
    total_data["is_basement"] = this.isBasement;
    total_data["exterior_type"] = this.exterior_type;
    total_data["roof_type"] == undefined ? this.roof_type : (this.roof_type = total_data["roof_type"]);
    total_data["personData"] = this.personData;
    total_data["email"] = this.email;
    total_data["phone"] = this.formatPhoneNumber(this.phone);
    total_data["low_price"] = this.lowPrice;
    total_data["high_price"] = this.highPrice;
    total_data["building_type"] = 1;
    total_data["roof_type"] = 1;
    total_data["roof_status"] = "peaked";
    await this.commonService.setLocalItem("total_data", total_data);
    // this.router.navigate(['/step6']);
  }

  async calcPriceRange(total_data) {
    const commonPricing = await this.commonService.getPricings(total_data);
    this.lowPrice = commonPricing["lowPrice"];
    this.highPrice = commonPricing["highPrice"];
  }
}
