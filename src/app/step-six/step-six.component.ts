import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {LocalStorageService} from 'angular-web-storage';
import {CommonService} from '../services/common.service';
import {ApiService} from '../services/api-service';
import {APICommonData, ModalData} from '../home/models';
import {OlarkService} from '../services/olark.service';

@Component({
  selector: 'app-step-six',
  templateUrl: './step-six.component.html',
  styleUrls: ['./step-six.component.scss'],
  providers: [OlarkService]
})
export class StepSixComponent implements OnInit, AfterViewInit, OnDestroy {
  showModal: EventEmitter<boolean> = new EventEmitter();
  modalData: ModalData;
  dwelling_value = 0;
  dwelling_basic = 0;
  contents = 0;
  structures = 0;
  liability = 0;
  deductible = 0;
  loss_of_use = 0;
  water_backup = 0;
  loss_assessment = 0;
  coverageAry: Array<any>;
  apiType: string;
  low_price: any;
  high_price: any;
  pricing: any;
  ConsumerURL: string;
  uniqueId: string;
  isMobile: boolean;
  stillwaterData: any;
  universalData: any;
  showNationWide = false;
  showMetlife = false;
  showTravellers = false;
  showUniversal = false;
  showPlymouth = false;
  showStillwater = false;
  showLiberty = false;
  showProgressive = false;
  stillwaterLoader = true;
  universalLoader = true;
  hippoLoader = true;
  plymouthLoader = true;
  libertyLoader = true;
  progressiveLoader = true;
  userInfo: object;
  universalPricing: number;
  universalQuoteLink: string;
  universalQuoteData: object;
  plymouthData: object;
  showChat = false;
  chatType: number;
  userData: object = {};
  insuranceImgs: object = [
    '../../assets/images/SVG/nationwide-icon.svg',
    '../../assets/images/metlife-tag.png',
    '../../assets/images/SVG/travelers-icon.svg',
    '../../assets/images/SVG/universal-icon.svg',
    '../../assets/images/plymouth_logo260x50.png',
    '../../assets/images/companies/liberty-mutual-transparent2.png',
    '../../assets/images/SVG/progressive-icon.svg',
    '../../assets/images/SVG/hippo-icon.svg',
    '../../assets/images/SVG/still-water.icon'
  ];

  bgColor: any = [
    "darkblue","darkgreen","red","darkred","#5bc0de","lightblue","#167EF8","green","darkyellow"
  ];
  chatPricing: number;
  insurances: Array<ModalData> = [];
  filteredInsurances: Array<ModalData> = [];
  filterConditions: any;
  priceLoaderCommonClass = 'col-md-4 col-6 mt-2 mb-2 form-row animated bounceIn';
  gridpriceWidgetCommonClass = 'col-md-4 col-6 mt-2 mb-2 form-row animated bounceIn';
  listpriceWidgetCommonClass = 'col-md-4 my-2 form-row animated bounceIn';
  viewmode: string;
  value_sort_up: boolean;

  @HostListener('window:resize', ['$event'])

  onResize(event) {
    this.isMobile = event.target.innerWidth <= 768;
  }

  constructor(
    public  router: Router,
    public local: LocalStorageService,
    public commonService: CommonService,
    private apiService: ApiService,
    public elemRef: ElementRef,
    private olark: OlarkService
  ) {
  }

  ngOnInit() {
    this.calcPrices();
    this.getPricing();
    this.viewmode = 'List';
  }

  ngOnDestroy(): void {
    // this.olark.hide();
  }

  ngAfterViewInit() {
    // @ts-ignore
    if (this.commonService.isMobileMode()) {
      this.setUpOlark();
    }
  }

  async setUpOlark() {
    await this.olark.load(window, document, 'static.olark.com/jsclient/loader.js');
    this.olark.identify('4797-648-10-9515');
    this.olark.hide();
  }

  async showChatWidget($event) {
    if (this.commonService.isMobileMode()) {
      this.olark.show();
    } else {
      this.showChat = true;
      this.chatType = $event.type;
      this.chatPricing = $event.price;
      await this.olark.load(window, document, 'static.olark.com/jsclient/loader.js');
      this.olark.identify('4797-648-10-9515');
      setTimeout(() => {
        document.querySelector('.chat-container').scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        });
      });
    }
  }

  async getPricing() {
    let total_data = this.commonService.getLocalItem('total_data');
    this.uniqueId = this.commonService.getUniqueID();
    const mode = total_data['mode'];
    this.apiType = '--';
    this.low_price = total_data['low_price'];
    this.high_price = total_data['high_price'];
    const {
      email, isGooglePlace, zillow, personData, phone, ac_year, plumbing_year, electric_year, roof_year, construction_type,
      building_type, roof_type, exterior_type, roof_status, is_basement, is_bundle, is_security, is_smart, foundation_type,
      smoke_alarm, dwell_coverage, central_fire_alarm, deadbolt_locks, central_bulgar_alarm, bundle_discount
    } = total_data;
    const firstname = personData[0].first_name;
    const lastname = personData[0].last_name;
    const birthday = "01-01-2000";
    let sqft, year_built, estimate, addressData: any;
    addressData = this.commonService.getAddressData();
    sqft = String(zillow['square']).replace(',', '');
    year_built = String(zillow['built_year']).replace(',', '');
    estimate = String(zillow['estimate']).replace(',', '');
    const data: APICommonData = {
      street: addressData['address'], city: addressData['locality'], state: addressData['administrative_area_level_1'],
      postal_code: addressData['postal_code'], sqft, email, year_built, estimate, mode, personData, ac_year, phone,
      plumbing_year, electric_year, roof_year, construction_type, building_type, roof_type, exterior_type, roof_status,
      is_basement, is_bundle, is_security, is_smart, foundation_type
    };
    if (mode == 1) {
      data['dwell_coverage'] = total_data['coverage'];
    }
    const params = {
      is_security: true,
      is_smart: true,
      is_bundle: true
    };
    Object.assign(data, params);
    setTimeout(() => {
      this.showNationWide = true;
      this.insurances.push(
        {
          type: 0,
          price: this.low_price,
          imgURL: this.insuranceImgs[0],
          bgColor:this.bgColor[0],
          dwelling: this.dwelling_basic,
          liability: 300000,
          contents: this.dwelling_basic * 0.5,
          waterBackup: 100000,
          deductible: 1000,
          keyword: ['well', 'bundle', 'extended', 'underground'],
          name:"Nationwide"
        });
      this.doFilter();
    }, 4000);
    // }, 4000);
    setTimeout(() => {
      this.showMetlife = true;
      this.insurances.push({
        type: 1,
        price: this.high_price,
        imgURL: this.insuranceImgs[1],
        bgColor:this.bgColor[1],
        dwelling: this.dwelling_basic,
        liability: 500000,
        contents: this.dwelling_basic * 0.5,
        waterBackup: 100000,
        deductible: 1000,
        keyword: ['well', 'bundle', 'extended', 'underground'],
        name:"MetLife"
      });
      this.doFilter();
    }, 6000);
    setTimeout(() => {
      this.showTravellers = true;
      this.insurances.push({
        type: 2,
        price: this.high_price + 47,
        imgURL: this.insuranceImgs[2],
        bgColor:this.bgColor[2],
        dwelling: this.dwelling_basic,
        liability: 500000,
        contents: this.dwelling_basic * 0.5,
        waterBackup: 100000,
        deductible: 1000,
        keyword: ['well', 'bundle', 'extended', 'underground'],
        name:"Travelers"
      });
      this.doFilter();
    }, 8000);
    this.apiService.getHippoData(data).subscribe(res => {
      this.hippoLoader = false;
      if (res['success']) {
        const data = JSON.parse(res['data']);
        if (data['quote_premium']) {
          this.insurances.push({
            type: 7,
            price: data['quote_premium'],
            imgURL: this.insuranceImgs[7],
            name:"Hippo",
            bgColor:this.bgColor[7],
            dwelling: data['coverage_a'],
            liability: 500000,
            contents: data['coverage_a'] * 0.5,
            waterBackup: 100000,
            deductible: 1000,
            keyword: ['extended', 'underground']
          });
        }
      }
      // let universal = total_data['insurance_data']['universal'];
      this.doFilter();
    });
    this.apiService.getUniversalData(data).subscribe(res => {
      const universal = res.data;
      // let universal = total_data['insurance_data']['universal'];
      if (universal.result === 'success') {
        this.universalData = universal;
        if (this.universalData['QuoteWrapper']['Message'] == 'OK') {
          this.universalPricing = this.universalData['QuoteWrapper']['Premium'];
          this.universalQuoteLink = this.universalData['QuoteWrapper']['QuoteLink'];
          this.universalQuoteData = this.universalData['QuoteWrapper']['Quote'];
          this.showUniversal = true;
          this.setInsuranceData('universal', this.universalData);
          this.insurances.push({
            type: 3,
            price: this.universalPricing,
            imgURL: this.insuranceImgs[3],
            bgColor:this.bgColor[3],
            dwelling: this.universalQuoteData['CoverageA'],
            liability: this.universalQuoteData['CoverageE'],
            contents: this.universalQuoteData['CoverageC'],
            waterBackup: 100000,
            deductible: this.universalQuoteData['AOPDeductible'],
            keyword: ['extended', 'underground'],
            name:"Universal"
          });
        }
      }
      this.universalLoader = false;
      this.doFilter();
    });
    this.apiService.getPlymouthData(data).subscribe((res) => {
      const plymouth = res;
      this.plymouthData = {};
      if (plymouth.result === 'success') {
        const plymouthAry = plymouth.data;
        const pricingKey = Object.keys(plymouthAry)[0];
        this.plymouthData = plymouthAry[pricingKey];
        this.showPlymouth = true;
        this.insurances.push({
          type: 4,
          price: this.plymouthData['pricing'] * 12,
          imgURL: this.insuranceImgs[4],
          bgColor:this.bgColor[4],
          dwelling: this.plymouthData['dwelling'],
          liability: this.plymouthData['personalLiability'],
          contents: this.dwelling_basic * 0.5,
          waterBackup: 100000,
          deductible: 1000,
          keyword: ['bundle', 'extended', 'underground'],
          name:"Plymouth"
        });
        this.doFilter();
        setTimeout(() => {
          this.showLiberty = true;
          this.insurances.push({
            type: 5,
            price: this.plymouthData['pricing'] * 12,
            imgURL: this.insuranceImgs[5],
            bgColor:this.bgColor[5],
            dwelling: this.plymouthData['dwelling'],
            liability: this.plymouthData['personalLiability'],
            contents: this.dwelling_basic * 0.5,
            waterBackup: 100000,
            deductible: 1000,
            keyword: ['well', 'extended', 'underground'],
            name:"Liberty Mutual"
          });
          this.doFilter();
        }, 2000);
        setTimeout(() => {
          this.showProgressive = true;
          this.insurances.push({
            type: 6,
            price: this.plymouthData['pricing'] * 12,
            imgURL: this.insuranceImgs[6],
            bgColor:this.bgColor[6],
            dwelling: this.plymouthData['dwelling'],
            liability: this.plymouthData['personalLiability'],
            contents: this.dwelling_basic * 0.5,
            waterBackup: 100000,
            deductible: 1000,
            keyword: ['bundle', 'extended', 'underground'],
            name:"Progressive"
          });
          this.doFilter();
        }, 4000);
        this.setInsuranceData('plymouth', this.plymouthData);
      }
      this.plymouthLoader = false;
      setTimeout(() => this.libertyLoader = false, 2000);
      setTimeout(() => this.progressiveLoader = false, 4000);
    });
    this.apiService.getStillwaterData(data).subscribe((res) => {
      this.stillwaterLoader = false;
      if (res.result === 'success') {
        this.stillwaterData = res.data;
        // this.stillwaterData = total_data['insurance_data']['stillwater'];
        this.apiType = 'stillwater';
        if (this.stillwaterData['ACORD'] == undefined) {
          this.commonService.modalOpen('Error', 'An error occurred. Please try again later.');
          return;
        }
        status = this.stillwaterData['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['MsgStatus']['MsgStatusCd'];
        try {
          const coverageAry = this.stillwaterData['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['HomeLineBusiness']['Dwell']['Coverage'];
          total_data['coverageAry'] = coverageAry;
          if (status == 'Success') {
            this.pricing = this.stillwaterData['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['PolicySummaryInfo']['FullTermAmt']['Amt'];
            this.ConsumerURL = this.stillwaterData['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['PolicySummaryInfo']['ItemIdInfo']['InsurerId'];
            this.uniqueId = this.stillwaterData['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['PersPolicy']['QuoteInfo']['CompanysQuoteNumber'];
            // this.pricing = total_data['pricing'];
            this.dwelling_value = coverageAry.filter(coverage => {
              return coverage['CoverageCd'] === 'DWELL';
            })[0]['Limit']['FormatInteger'];
            this.contents = coverageAry.filter(coverage => {
              return coverage['CoverageCd'] === 'PP';
            })[0]['Limit']['FormatInteger'];
            this.structures = mode == 0 ? coverageAry.filter(coverage => {
              return coverage['CoverageCd'] === 'OS';
            })[0]['Limit']['FormatInteger'] : '';
            this.liability = coverageAry.filter(coverage => {
              return coverage['CoverageCd'] === 'PL';
            })[0]['Limit']['FormatInteger'];
            this.deductible = mode == 1 ? coverageAry.filter(coverage => {
              return coverage['CoverageCd'] === 'PP';
            })[0]['Deductible']['FormatInteger'] : '';
            this.loss_of_use = coverageAry.filter(coverage => {
              return coverage['CoverageCd'] === 'LOU';
            })[0]['Limit']['FormatInteger'];
            this.water_backup = coverageAry.filter(coverage => {
              return coverage['CoverageCd'] === 'SEWER';
            })[0]['Limit']['FormatInteger'];
            this.loss_assessment = mode == 1 ? coverageAry.filter(coverage => {
              return coverage['CoverageCd'] === 'LAC';
            })[0]['Limit']['FormatInteger'] : '';
            total_data['pricing'] = this.pricing;
            total_data['ConsumerURL'] = this.ConsumerURL;
            total_data['apiType'] = 'Stillwater';
            if (mode == 1) {
              Object.assign(this.userData, {dwell_coverage: total_data['coverage']});
            }
            this.showStillwater = true;
            this.insurances.push({
              type: 8,
              price: this.pricing,
              imgURL: this.insuranceImgs[8],
              bgColor:this.bgColor[8],
              dwelling: this.dwelling_value,
              liability: this.liability,
              contents: this.contents,
              waterBackup: this.water_backup,
              deductible: 1000,
              keyword: ['bundle', 'extended', 'underground'],
              name:"Stillwater"
            });
            this.doFilter();
            this.setInsuranceData('stillwater', this.stillwaterData);

            const hippoPrice = this.getHippoPrice();
            Object.assign(this.userData, {
              first_name: firstname,
              last_name: lastname,
              amount: this.pricing,
              email: email,
              birthday: birthday,
              address: addressData['address'],
              city: addressData['locality'],
              county: addressData['administrative_area_level_2'],
              state: addressData['administrative_area_level_1'],
              zip_code: addressData['postal_code'],
              alarm: total_data['is_security'],
              delivery: total_data['is_smart'],
              bundle: total_data['is_bundle'],
              low_price: total_data['low_price'],
              high_price: total_data['high_price'],
              pricing: this.pricing,
              isGooglePlace: isGooglePlace,
              quote_id: this.uniqueId,
              year_built: zillow['built_year'],
              sqft: zillow['square'],
              estimate: zillow['estimate'],
              chartImgStr: total_data['chartbase64Img'],
              hippoPrice: hippoPrice,
              phone,
              ac_year,
              electric_year,
              plumbing_year,
              roof_year,
              construction_type,
              roof_type,
              personData,
              building_type,
              roof_status,
              exterior_type,
              is_basement,
              foundation_type,
              central_fire_alarm,
              deadbolt_locks,
              central_bulgar_alarm,
              bundle_discount,
              mode,
            });
            this.apiService.saveUserData(this.userData).subscribe(async (res) => {
              if (res.result === 'success') {
                await this.commonService.removeLocalItem('unique_id');
                await this.commonService.setLocalItem('unique_id', res['quote_id']);
                // this.router.navigate(['/step6']);
              } else {
                this.commonService.modalOpen('Warning', 'Please enter all required fields.');
              }
            });
          } else {
            let message = this.stillwaterData['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['MsgStatus']['MsgStatusDesc'];
            try {
              message = message.split(':')[1].trim();
              if (message.indexOf('FRIQ100Q') > 0) {
                message = 'Service is unavailable now.\n';

              }
            } catch (e) {
              message = 'An error occurred.';
            }
            this.commonService.modalOpen('Error', message);
          }
        } catch (e) {

        }
      }
    });
  }

  allDataLoaded() {
    return this.showNationWide && this.showMetlife && this.showTravellers && !this.universalLoader &&
      !this.plymouthLoader && !this.libertyLoader && !this.progressiveLoader && !this.stillwaterLoader;
  }

  calcPrices() {
    const total_data = this.local.get('total_data');
    let square, estimate;

    if ((typeof total_data['zillow']['square']) == 'string') {
      square = parseInt(total_data['zillow']['square'].replace(',', ''));
      estimate = parseInt(total_data['zillow']['estimate'].replace(',', ''));
    } else {
      square = total_data['zillow']['square'];
      estimate = total_data['zillow']['estimate'];
    }
    this.dwelling_basic = ((square * 200) + estimate) / 2;
  }

  bindNow() {
    const uniqueId = this.commonService.getLocalItem('unique_id');
    const data = {uniqueId};
    this.apiService.bindNow(data).subscribe(res => {
      // if (res['result'] == 'success') {
      this.router.navigate(['/step7']);
      // }
    }, (err) => {
    });
  }

  setModalData(data) {
    this.modalData = data;
    this.showModal.emit(true);
  }

  goForChat() {
    const total_data = this.commonService.getLocalItem('total_data');
    let mortgage_data = total_data['mortgage_data'];
    if (!mortgage_data) {
      mortgage_data = {};
    }
    mortgage_data['imgURL'] = '';
    mortgage_data['price'] = '';
    this.commonService.applyTotalData('mortgage_data', mortgage_data);
    this.router.navigateByUrl('/preparing-policy');
  }
  getHippoPrice() {
    let price, hippo;
    try {
      hippo = JSON.parse(this.commonService.getLocalItem('total_data').hippo);
      price = hippo.quote_premium;
    } catch (e) {
      price = '';
    }
    return price;
  }
  setInsuranceData(key, value) {
    console.log(key, value);
    const total_data = this.commonService.getLocalItem('total_data');
    let insurance_data = total_data['insurance_data'];
    if (!insurance_data) {
      insurance_data = {};
    }
    Object.assign(insurance_data, {[key]: value});
    Object.assign(total_data, {insurance_data});
    this.commonService.setLocalItem('total_data', total_data);
    this.uniqueId = this.commonService.getUniqueID();
  }

  sortPrices(type) {
    if (type == 'DESC') {
      this.filteredInsurances = this.filteredInsurances.sort((a, b) => b.price - a.price);
    } else if (type == 'ASC'){
      this.filteredInsurances = this.filteredInsurances.sort((a, b) => a.price - b.price);
    } else {
      if (this.value_sort_up) {
        this.filteredInsurances = this.filteredInsurances.sort((a, b) => a.dwelling - b.dwelling);
        this.value_sort_up = false;
      } else {
        this.filteredInsurances = this.filteredInsurances.sort((a, b) => b.dwelling - a.dwelling);
        this.value_sort_up = true;
      }
    }
  }

  doFilter(conditions = {}) {
    const filters = [];
    if (conditions.hasOwnProperty('well')) {
      this.filterConditions = conditions;
    }
    if (!this.filterConditions) {
      return;
    }
    Object.keys(this.filterConditions).forEach((condition) => {
      if (this.filterConditions[condition]) {
        filters.push(condition);
      }
    });
    this.filteredInsurances = this.insurances.filter((insurance) => insurance.keyword.some(r => filters.includes(r)));
  }
}
