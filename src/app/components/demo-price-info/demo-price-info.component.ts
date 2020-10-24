import { Component, OnInit } from "@angular/core";
import { CommonService } from "../../services/common.service";

@Component({
  selector: "app-demo-price-info",
  templateUrl: "./demo-price-info.component.html",
  styleUrls: ["./demo-price-info.component.scss"],
})
export class DemoPriceInfoComponent implements OnInit {
  constructor(public commonService: CommonService) {}

  public apiResultPriceData: any;
  addressInfo: object;
  zillowInfo: object;
  floodInfo: object;

  ngOnInit() {
    this.addressInfo = this.commonService.getAddressData();
    this.zillowInfo = this.getInfo("zillow");
    this.floodInfo = this.getInfo("flood").data;

    //    console.log ('zillow', this.getInfo('zillow'));

    // Debugging Prices
    const total_data = this.commonService.getLocalItem("total_data");

    console.log("hippo", JSON.parse(total_data.hippo));
    console.log("flood", this.floodInfo);

    if (total_data.demo) {
      this.apiResultPriceData = total_data.demo_condo_data;
    } else {
      this.apiResultPriceData = total_data.demo_homeowner_data;
    }
    if (!this.apiResultPriceData) {
      this.apiResultPriceData = [];
    }

    this.getPrices("hippo");
    this.getPrices("plymouth");
    this.getPrices("stillwater");
    this.getPrices("universal");
    console.log("19. Flood Price:                ", total_data["flood"]["data"]["premium"]);
  }

  getInfo(key) {
    const total_data = this.commonService.getLocalItem("total_data");
    if (total_data) return total_data[key];
  }

  getPrices(name) {
    let data: any = [];
    switch (name) {
      case "plymouth":
        data = this.getPlymouthPrice();
        break;
      case "stillwater":
        data = this.getStillwaterPrice();
        break;
      case "universal":
        data = this.getUniversalPrice();
        break;
      case "hippo":
        data = this.getHippoPrice();
        break;
    }
  }

  getPlymouthPrice() {
    const data = this.apiResultPriceData.plymouth;
    if (!data || Object.keys(data).length === 0) {
      return;
    }
    const result = [];
    Object.keys(data).map((item) => {
      let pricing: any = parseFloat(data[item].pricing);
      pricing = pricing * 12;
      const { high, low } = this.commonService.getBurstPrices(pricing);

      let high1 = Math.floor(high);
      let low1 = Math.floor(low);
      let pricing1 = Math.floor(pricing);

      //console.log (item);
      if (item == "good") {
        //      console.log(`Plymouth ${item} Burst Price: `, pricing1);
        //      console.log(`Plymouth ${item} Burst Low: `, low1);
        //      console.log(`Plymouth ${item} Burst High: `, high1);
        console.log(`4. Plymouth Good Burst Price:   `, pricing1);
        console.log(`5. Plymouth Good Burst Low:     `, low1);
        console.log(`6. Plymouth Good Burst High:    `, high1);
      } else if (item == "better") {
        console.log(`7. Plymouth Better Burst Price: `, pricing1);
        console.log(`8. Plymouth Better Burst Low:   `, low1);
        console.log(`9. Plymouth Better Burst High:  `, high1);
      } else if (item == "best") {
        console.log(`10. Plymouth Best Burst Price:  `, pricing1);
        console.log(`11. Plymouth Best Burst Low:    `, low1);
        console.log(`12. Plymouth Best Burst High:   `, high1);
      }
    });
  }

  getStillwaterPrice() {
    const data = this.apiResultPriceData.stillwater;
    try {
      let pricing: number = data["ACORD"]["InsuranceSvcRs"]["HomePolicyQuoteInqRs"]["PolicySummaryInfo"]["FullTermAmt"]["Amt"];
      const uniqueId = data.ACORD.InsuranceSvcRs.HomePolicyQuoteInqRs.PolicySummaryInfo.PolicyNumber;
      this.commonService.setLocalItem("unique_id", uniqueId);
      pricing = parseFloat(String(pricing));
      let { high, low } = this.commonService.getBurstPrices(pricing);
      high = Math.floor(high);
      low = Math.floor(low);
      pricing = Math.floor(pricing);
      console.log(`13. Stillwater Burst Price:     `, pricing);
      console.log(`14. Stillwater Burst Low:       `, low);
      console.log(`15. Stillwater Burst High:      `, high);
    } catch (e) {}
  }

  getUniversalPrice() {
    const data = this.apiResultPriceData.universal;
    try {
      let pricing: number = data.QuoteWrapper.Premium;
      pricing = parseFloat(String(pricing));
      let { high, low } = this.commonService.getBurstPrices(pricing);
      high = Math.floor(high);
      low = Math.floor(low);
      pricing = Math.floor(pricing);

      console.log(`16. Universal API Price:        `, pricing);
      console.log(`17. Universal Burst Low:        `, low);
      console.log(`18. Universal Burst High:       `, high);
    } catch (e) {}
  }

  getHippoPrice() {
    try {
      let data = this.commonService.getLocalItem("total_data").hippo;
      data = JSON.parse(data);
      let pricing: number = data.quote_premium;
      pricing = parseFloat(String(pricing));
      let { high, low } = this.commonService.getBurstPrices(pricing);

      high = Math.floor(high);
      low = Math.floor(low);
      pricing = Math.floor(pricing);

      console.log(`1. HIPPO API Price:             `, pricing);
      console.log(`2. HIPPO Burst Low:             `, low);
      console.log(`3. HIPPO Burst High:            `, high);
    } catch (e) {}
  }
}
