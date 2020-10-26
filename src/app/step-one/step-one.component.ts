import { AfterViewInit, Component, ElementRef, HostListener, NgZone, ViewChild, EventEmitter, Output } from "@angular/core";
import { SwiperComponent } from "ngx-useful-swiper";
import { addressData } from "../home/models";
import { Router } from "@angular/router";
import { ApiService } from "../services/api-service";
import { CommonService } from "../services/common.service";
import { MapsAPILoader } from "@agm/core";
import { LocalStorageService } from "angular-web-storage";
import CacheManager from "../utils/CacheManager";
import * as $ from "jquery";

declare var google;

@Component({
  selector: "app-step-one",
  templateUrl: "./step-one.component.html",
  styleUrls: ["./step-one.component.scss"],
})
export class StepOneComponent implements AfterViewInit {
  @ViewChild("placesRef", { static: false })
  public searchElementRef: ElementRef;
  @ViewChild("usefulSwiper", { static: false })
  public usefulSwiper: SwiperComponent;
  config: any = {
    initialSlide: 1,
    runCallbacksOnInit: true,
    on: {
      slideChange: () => {
        if (!!this.usefulSwiper && !!this.usefulSwiper.swiper && this.usefulSwiper.swiper.activeIndex == 0) {
          this.usefulSwiper.swiper.allowSlidePrev = true;
          // this.next.emit();
          this.processDemoQuote();
        }
      },
    },
  };
  window: any = window;
  cacheMode: boolean = false;

  addressData: addressData = {
    address: "",
    street_number: "",
    route: "",
    locality: "",
    administrative_area_level_1: "",
    country: "",
    postal_code: "",
  };
  GooglePlace: boolean = true;
  fullAddressText: string = "";
  isMobile: boolean;
  lat: string;
  lng: string;
  showLoader: boolean;
  loaderType: string = "slow";
  plymouth: object;
  universal: object;
  stillwater: object;
  isDisplay: boolean = false;
  isFinished: boolean = false;
  isProcessing: boolean = false;
  progress: number = 0;
  showGoogleMap: boolean = false;
  showGoogleApiLogo: boolean = false;
  showAwsLogo: boolean = false;
  showZillowLogo: boolean = false;
  showZillowYear: boolean = false;
  showZillowEst: boolean = false;
  showZillowSqft: boolean = false;
  showMet: boolean = false;
  showProgressive: boolean = false;
  showTraveler: boolean = false;
  showNationwide: boolean = false;
  showPlymouth: boolean = false;
  showStateAuto: boolean = false;
  showUniversal: boolean = false;
  showStillWater: boolean = false;
  showNeptune: boolean = false;
  show2ndGoogleMap: boolean = false;
  show2ndGoogleApiLogo: boolean = false;
  show2ndAwsLogo: boolean = false;
  showZ2ndillowLogo: boolean = false;
  show2ndMet: boolean = false;
  show2ndProgressive: boolean = false;
  show2ndTraveler: boolean = false;
  show2ndNationwide: boolean = false;
  show2ndPlymouth: boolean = false;
  show2ndStateAuto: boolean = false;
  show2ndUniversal: boolean = false;
  show2ndStillWater: boolean = false;
  show2ndNeptune: boolean = false;
  showCompleted: boolean = false;
  zillowData: object = {};
  showZillowPane: boolean = false;
  show2ndZillowPane: boolean = false;
  showZillowOuterContainer: boolean = false;
  totalProgress: number = 0;
  selectedMode: number = 0;
  coverage: number = 25000;
  zillowParams: object = {};
  isMobileVideoDisplay: boolean = false;
  isMobileMode: boolean = this.commonService.isMobileMode();
  showFirst: boolean = false;

  @Output() removeFooter = new EventEmitter<boolean>();

  constructor(private router: Router, public apiService: ApiService, private ngZone: NgZone, public commonService: CommonService, private mapsAPILoader: MapsAPILoader, public local: LocalStorageService) {}

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  @HostListener("window:resize", ["$event"])
  onResize() {
    this.isMobileMode = this.commonService.isMobileMode();
  }

  ngAfterViewInit(): void {
    this.loadGooglePlace();
    this.commonService.clearValues();
  }

  async loadGooglePlace() {
    this.mapsAPILoader.load().then(() => {
      if (this.GooglePlace) {
        setTimeout(() => {
          let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
            types: ["address"],
            componentRestrictions: { country: "USA" },
          });
          autocomplete.addListener("place_changed", async () => {
            this.ngZone.run(async () => {
              let address = autocomplete.getPlace();
              this.handleAddressChange(address);
            });
          });
        });
      }
    });

    document.getElementById("inputAddressMD").focus();
  }

  handleAddressChange(googlePlaceData) {
    this.commonService.applyTotalData("address_components", googlePlaceData);
    this.lat = typeof googlePlaceData.geometry.location.lat === "function" ? googlePlaceData.geometry.location.lat() : googlePlaceData.geometry.location.lat;
    this.lng = typeof googlePlaceData.geometry.location.lng === "function" ? googlePlaceData.geometry.location.lng() : googlePlaceData.geometry.location.lng;
    const googlePlaceDataCache = { ...googlePlaceData };
    googlePlaceDataCache.geometry.location.lat = () => this.lat;
    googlePlaceDataCache.geometry.location.lng = () => this.lng;
    CacheManager.setValue("googlePlaceData", googlePlaceDataCache);
    try {
      this.fullAddressText = this.commonService.getLocalItem("total_data").address_components.formatted_address;
    } catch (e) {
      this.fullAddressText = "";
    }
    try {
      const { address, locality, administrative_area_level_1, postal_code } = this.commonService.getAddressData();
      this.isDisplay = true;
      this.zillowParams = {
        address: address,
        citystatezip: locality + ", " + administrative_area_level_1 + ", " + postal_code,
      };
      this.processDemoQuote();
    } catch (e) {
      this.commonService.modalOpen("Error", "Please enter the correct address type.");
    }
  }

  handleAddressChangeWithCache() {
    this.cacheMode = true;
    this.handleAddressChange(CacheManager.getValue("googlePlaceData"));
  }

  async getZillowData(data) {
    return new Promise((resolve, reject) => {
      this.apiService.getZillow(data).subscribe(
        (res) => {
          if (!res.hasOwnProperty("price")) {
            this.isDisplay = false;
            this.commonService.modalOpen("Error", "Exact address not found, please enter manually.");
            // this.GooglePlace = false;
            reject({
              result: "error",
              code: 508,
              message: "Exact address not found, please enter manually.",
            });
            return;
          } else if (res["result"] == "error") {
            this.isDisplay = false;
            reject({
              result: "error",
              code: 400,
              message: "An error occurred. Please try again later.",
            });
            return;
          }
          if (res.hasOwnProperty("price")) {
            const estimate = res.price;
            this.zillowData["square"] = res.building_size;
            this.zillowData["built_year"] = res.year_built;
            this.zillowData["estimate"] = estimate != NaN ? this.commonService.commafy(estimate) : 0;
            resolve({
              result: "success",
              code: 200,
              message: "Successfully completed.",
            });
          }
        },
        (err) => {
          reject({
            result: "error",
            code: 400,
            message: "An error occurred. Please try again later.",
          });
        }
      );
    });
  }

  async processZillowData(zillowData) {
    this.commonService.applyTotalData("zillow", this.zillowData);
    this.commonService.applyTotalData("isGooglePlace", this.GooglePlace);
  }

  async processDemoQuote() {
    if (this.cacheMode) {
      this.processDemoQuoteWithCache();
    } else {
      const zillowData = await this.getZillowData(this.zillowParams);
      CacheManager.setValue("zillowData", this.zillowData);
      this.isProcessing = true;
      console.log("1111111111111");
      this.removeFooter.emit(false);

      this.processZillowData(zillowData);

      const total_data = this.commonService.getLocalItem("total_data");
      if (total_data["insuranceOptions"]) {
        if (total_data["insuranceOptions"]["life"]) {
          this.router.navigateByUrl("/haven-inputs");
        } else {
          this.getPricingDataForMobile();
          this.process();
        }
      } else {
        this.getPricingDataForMobile();
        this.process();
      }
    }
  }

  async processDemoQuoteWithCache() {
    const zillowData = CacheManager.getValue("zillowData");
    this.zillowData = zillowData;
    this.processZillowData(zillowData);
  }

  // async blinkSequenceFirstImgs(isNext?) {
  async blinkSequenceFirstImgs() {
    this.showGoogleApiLogo = true;
    await this.sleep(200);
    this.showGoogleApiLogo = false;
    this.showAwsLogo = true;
    await this.sleep(200);
    this.showAwsLogo = false;
    this.showZillowPane = true;
    await this.sleep(200);
    this.showZillowPane = false;
    this.showNationwide = true;
    await this.sleep(200);
    this.showNationwide = false;
    this.showProgressive = true;
    await this.sleep(200);
    this.showProgressive = false;
    this.showMet = true;
    await this.sleep(200);
    this.showMet = false;
    this.showTraveler = true;
    await this.sleep(200);
    this.showTraveler = false;
    this.showPlymouth = true;
    await this.sleep(200);
    this.showPlymouth = false;
    this.showStateAuto = true;
    await this.sleep(200);
    this.showStateAuto = false;
    this.showUniversal = true;
    await this.sleep(200);
    this.showUniversal = false;
    this.showStillWater = true;
    await this.sleep(200);
    this.showStillWater = false;
    this.showNeptune = true;
    await this.sleep(200);
    this.showNeptune = false;
    this.show2ndGoogleApiLogo = true;
    await this.sleep(200);
    // ---------
    this.show2ndGoogleApiLogo = false;
    this.show2ndAwsLogo = true;
    await this.sleep(200);
    this.show2ndAwsLogo = false;
    this.show2ndZillowPane = true;
    await this.sleep(200);
    this.show2ndZillowPane = false;
    this.show2ndNationwide = true;
    await this.sleep(200);
    this.show2ndNationwide = false;
    this.show2ndProgressive = true;
    await this.sleep(200);
    this.show2ndProgressive = false;
    this.show2ndMet = true;
    await this.sleep(200);
    this.show2ndMet = false;
    this.show2ndTraveler = true;
    await this.sleep(200);
    this.show2ndTraveler = false;
    this.show2ndPlymouth = true;
    await this.sleep(200);
    this.show2ndPlymouth = false;
    this.show2ndStateAuto = true;
    await this.sleep(200);
    this.show2ndStateAuto = false;
    this.show2ndUniversal = true;
    await this.sleep(200);
    this.show2ndUniversal = false;
    this.show2ndStillWater = true;
    await this.sleep(200);
    this.show2ndStillWater = false;
    this.show2ndNeptune = true;
    await this.sleep(200);
    this.show2ndNeptune = false;
    await this.sleep(200);
    if (this.progress <= 99) {
      // this.blinkSequenceFirstImgs(true);
      this.blinkSequenceFirstImgs();
    }
    return new Promise((r) => {
      r("success");
    });
  }

  sleep(m) {
    return new Promise((r) => setTimeout(r, m));
  }

  async process() {
    window.scrollTo(0, 0);
    const n = setInterval(() => {
      if (this.totalProgress <= 99) {
        this.totalProgress++;
        return;
      }
      clearInterval(n);
    }, 150);
    // this.showGoogleApiLogo = true; // Show initial image

    this.blinkSequenceFirstImgs();
    await this.initSequences(150);

    this.gotToStepTwo();
  }

  initSequences(duration) {
    return new Promise((r) => {
      this.progress = 0;
      const n = setInterval(() => {
        if (this.progress <= 99) {
          this.progress++;
        } else {
          clearInterval(n);
          r("success");
        }
      }, duration);
      this.showCompleted = false;
    });
  }

  async getPricingDataForMobile() {
    const currentYear = new Date().getFullYear();
    let electric_year, plumbing_year, roof_year;
    const addressData = this.commonService.getAddressData();
    let city = addressData["locality"],
      state = addressData["administrative_area_level_1"],
      postal_code = addressData["postal_code"],
      street = addressData["address"],
      year_built = this.zillowData["built_year"],
      sqft = this.zillowData["square"], //.replace(",", ""),
      mode = this.selectedMode,
      ac_year = (electric_year = plumbing_year = roof_year = currentYear),
      construction_type = 1,
      roof_type = 1,
      foundation_type = 1,
      dwell_coverage = this.coverage,
      building_type = 1,
      roof_status = "peaked",
      is_basement = 1,
      is_demo = true;

    const demoRequestParams = {
      city,
      state,
      postal_code,
      street,
      year_built,
      sqft,
      mode,
      ac_year,
      electric_year,
      plumbing_year,
      roof_year,
      construction_type,
      roof_type,
      dwell_coverage,
      building_type,
      roof_status,
      is_basement,
      foundation_type,
      is_demo,
    };

    const params = {
      is_security: true,
      is_smart: true,
      is_bundle: true,
    };
    /*Homeowners API requests*/

    Object.assign(demoRequestParams, params);
    this.getNeptuneFloodData(demoRequestParams);
    this.getHippoData(demoRequestParams);
    this.makeCondoRequests(demoRequestParams);
    this.makeHomeownersRequests(demoRequestParams);
    /*Condo API requests*/

    this.isFinished = true;
  }

  getNeptuneFloodData(params) {
    this.apiService.getNeptuneData(params).subscribe(
      (res) => {
        const total_data = this.local.get("total_data");
        total_data["flood"] = res;
        this.local.set("total_data", total_data);
      },
      (err) => {
        alert("error");
        console.log(err);
      }
    );
  }

  getHippoData(params) {
    this.apiService.getHippoData(params).subscribe(
      (res) => {
        if (!res["success"]) return;
        const total_data = this.local.get("total_data");
        total_data["hippo"] = res["data"];
        this.local.set("total_data", total_data);
      },
      (err) => {
        alert("error");
        console.log(err);
      }
    );
  }

  async makeHomeownersRequests(demoRequestParams) {
    let demo_homeowner_data = {};
    demoRequestParams["mode"] = 0;
    let total_data = this.local.get("total_data");
    this.apiService.getPlymouthData(demoRequestParams).subscribe((plymouth) => {
      console.log("plymouth homeowner", plymouth);
      plymouth.result === "success" ? (this.plymouth = plymouth.data) : (this.plymouth = {});
      let total_data = this.local.get("total_data");
      Object.assign(demo_homeowner_data, { plymouth: this.plymouth });
      Object.assign(total_data, { demo_homeowner_data });
      this.local.set("total_data", total_data);
    });
    this.apiService.getUniversalData(demoRequestParams).subscribe((universal) => {
      console.log("universal homeowner", universal);
      universal.result === "success" ? (this.universal = universal.data) : (this.universal = {});
      total_data = this.local.get("total_data");
      Object.assign(demo_homeowner_data, { universal: this.universal });
      Object.assign(total_data, { demo_homeowner_data });
      this.local.set("total_data", total_data);
    });

    this.apiService.getStillwaterData(demoRequestParams).subscribe((stillwater) => {
      console.log("stillwater homeowner", stillwater);
      stillwater.result === "success" ? (this.stillwater = stillwater.data) : (this.stillwater = {});
      total_data = this.local.get("total_data");
      Object.assign(demo_homeowner_data, { stillwater: this.stillwater });
      Object.assign(total_data, { demo_homeowner_data });
      this.local.set("total_data", total_data);
    });
  }

  async makeCondoRequests(demoRequestParams) {
    let demo_condo_data = {};
    demoRequestParams["mode"] = 1;
    let total_data = this.local.get("total_data");
    this.apiService.getPlymouthData(demoRequestParams).subscribe((plymouth) => {
      console.log("plymouth condo", plymouth);
      plymouth.result === "success" ? (this.plymouth = plymouth.data) : (this.plymouth = {});
      let total_data = this.local.get("total_data");
      Object.assign(demo_condo_data, { plymouth: this.plymouth });
      Object.assign(total_data, { demo_condo_data });
      this.local.set("total_data", total_data);
    });
    this.apiService.getUniversalData(demoRequestParams).subscribe((universal) => {
      console.log("universal condo", universal);
      universal.result === "success" ? (this.universal = universal.data) : (this.universal = {});
      total_data = this.local.get("total_data");
      Object.assign(demo_condo_data, { universal: this.universal });
      Object.assign(total_data, { demo_condo_data });
      this.local.set("total_data", total_data);
    });

    this.apiService.getStillwaterData(demoRequestParams).subscribe((stillwater) => {
      console.log("stillwater condo", stillwater);
      stillwater.result === "success" ? (this.stillwater = stillwater.data) : (this.stillwater = {});
      total_data = this.local.get("total_data");
      Object.assign(demo_condo_data, { stillwater: this.stillwater });
      Object.assign(total_data, { demo_condo_data });
      this.local.set("total_data", total_data);
    });
  }

  gotToStepTwo() {
    this.router.navigate(["/demo"]);
  }

  clickBegin() {
    this.showFirst = true;
    $("#address_div").removeClass("d-none");
  }
}

/*comment*/
