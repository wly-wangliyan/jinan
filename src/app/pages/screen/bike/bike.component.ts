import {HeatMapLevelComponent} from './common-component/heat-map-level/heat-map-level.component';
import {BikeHttpService, StatisticCountEntity} from './bike-http.service';
import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {GlobalConst} from '../../../share/global-const';
import {BicycleAreaNumListenerService} from './bicycle-area-num-listener.service';

declare var AMap: any;

@Component({
  selector: 'app-bike',
  templateUrl: './bike.component.html',
  styleUrls: ['./bike.component.less']
})
export class BikeComponent implements OnInit {
  public total_order_num = 0;
  public total_travel_num = 0;
  public dataList: Array<any> = [];

  public isShowBasicHeatMap = true; // 默认显示基础图层
  public isShowAlertMap = true; // 默认显示预警图层
  public companyList: Array<any> = [];

  @ViewChild('pageLeftRef') public pageLeftRef: ElementRef;
  @ViewChild('heatMapLevel') public heatMapLevel: HeatMapLevelComponent;
  // @ViewChild('fullHeatMapLevel') public fullHeatMapLevel: FullBicycleHeatMapComponent;

  private tempCountDataList: Array<any> = [];
  private searchText$ = new Subject<any>();
  private timerSubscription: Subscription;
  private dataSubscription: Subscription;
  private areaBicycleNumDivClickSubscription$: Subscription;

  constructor(
    private service: BikeHttpService,
    private renderer2: Renderer2,
    private bicycleAreaNumListenerSerivice: BicycleAreaNumListenerService
  ) {
  }

  ngOnInit(): void {
    this.requestAllCompanyList();

    this.searchText$.subscribe(() => {
      this.requestOrderCount();
    });
    this.searchText$.subscribe(() => {
      this.requestTravelCount();
    });
    this.searchText$.next();

    this.areaBicycleNumDivClickSubscription$ && this.areaBicycleNumDivClickSubscription$.unsubscribe();
    this.areaBicycleNumDivClickSubscription$ = this.bicycleAreaNumListenerSerivice.areaBicycleNumDivClick$.subscribe((res) => {
      if (res === 'back') {
        this.renderer2.setStyle(this.pageLeftRef.nativeElement, 'left', '0px');
      } else {
        this.renderer2.setStyle(this.pageLeftRef.nativeElement, 'left', '-500px');
      }
    });
  }

  // 所属企业下拉列表
  private requestAllCompanyList(): void {
    this.service.requestEnterpriseRecordAllList()
      .subscribe(res => {
        const companyList = res.results.slice(0, GlobalConst.FullScreenCompanyShowCount) || [];
        companyList && companyList.sort((itemA, itemB) => itemA.company_type - itemB.company_type);
        this.companyList = companyList;
      }, err => {

      });
  }

  // 获取单车订单数
  private requestOrderCount(): void {
    this.dataSubscription = this.service.requestBicycleOrderCountData()
      .subscribe(backData => {
        this.tempCountDataList = backData || [];
        this.generateCountData();
      }, err => {
        // this.globalService.httpErrorProcess(err);
      });
  }

  // 获取实时单车行驶中数量
  private requestTravelCount(): void {
    this.dataSubscription = this.service.requestBicycleTravelCountData()
      .subscribe(backData => {
        this.tempCountDataList = backData || [];
        this.generateCountData();
      }, err => {
        // this.globalService.httpErrorProcess(err);
      });
  }

  private generateCountData(): void {
    const tempList = [];
    let total_order_num = 0;
    let total_travel_num = 0;
    this.companyList && this.companyList.forEach(company => {
      const dataList = this.tempCountDataList.filter(data => data.company_id === company.company_id);
      if (dataList && dataList.length > 0) {
        total_order_num += dataList[0].order_count || 0;
        total_travel_num += dataList[0].travel_count || 0;
        tempList.push(dataList[0]);
      } else {
        const statisticsItem = new StatisticCountEntity();
        statisticsItem.company_id = company.company_id;
        statisticsItem.company_type = company.company_type;
        statisticsItem.travel_count = 0;
        statisticsItem.order_count = 0;
        tempList.push(statisticsItem);
      }
    });
    this.dataList = tempList;
    this.total_order_num = total_order_num;
    this.total_travel_num = total_travel_num;
  }


  /**** 图层显示 ****/

  /* 显示/隐藏基础图层 */
  public onHeadMapBasicLayerBtnClick(): void {
    this.isShowBasicHeatMap = !this.isShowBasicHeatMap;
    this.heatMapLevel.isShowBasicHeatMap = this.isShowBasicHeatMap;
    if (this.isShowBasicHeatMap) {
      this.heatMapLevel.heatMapH && this.heatMapLevel.heatMapH.show();
    } else {
      this.heatMapLevel.heatMapH && this.heatMapLevel.heatMapH.hide();
    }
  }

  /* 显示/隐藏预警图层 */
  public onHeadMapCustomLayerBtnClick(): void {
    this.isShowAlertMap = !this.isShowAlertMap;
    this.heatMapLevel.isShowCustomHeatMap = this.isShowAlertMap;
    if (this.isShowAlertMap) {
      this.heatMapLevel.showCustomMapInfo(this.heatMapLevel.initCustomStatisticsH);
    } else {
      this.heatMapLevel.removeCustomLayer();
    }
  }

  // 点击左侧列表项对应显示图层区域信息
  public onReceiveBikeMessageClick(e) {
    if (!this.isShowAlertMap){
      this.isShowAlertMap = true;
      this.heatMapLevel.isShowCustomHeatMap = this.isShowAlertMap;
      this.heatMapLevel.showCustomMapInfo(this.heatMapLevel.initCustomStatisticsH);
    }
    this.heatMapLevel.listShowInfoWindow(e);
  }

}
