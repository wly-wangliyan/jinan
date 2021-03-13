import {REFRESH_DURATION, TimerService} from '../../../../core/timer.service';
import {BikeHttpService} from '../bike-http.service';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {EChartOptionHelper, PieDataItem} from '../../../../../utils/echart-option-helper';
import {GlobalConst} from '../../../../share/global-const';

const CompanyTypeObj = {
  0: {name: '其他', normal_color: '#5946E8', assistance_color: '#594688'},
  1: {name: '青桔', normal_color: '#42E0FC', assistance_color: '#A4E5FF'},
  2: {name: '哈罗', normal_color: '#3473FE', assistance_color: '#0038B2'},
  3: {name: '美团', normal_color: '#F7B500', assistance_color: '#F76E00'}
};

export class BicycleTypeDataItem extends PieDataItem {
  public name: string; // 名称
  public value: number; // 单车数量
  public company_id: string; // 企业id
  public company_type_name: string; // 企业简称
  public company_type: number; // 企业类型
  public type: string; // 单车类型名称 单车/助力车
  public color: string; // 颜色

  constructor(
    company_id: string, company_type: number, type: '单车' | '助力车', value: number, color: string) {
    super();
    this.value = value;
    this.company_id = company_id;
    this.company_type_name = CompanyTypeObj[company_type].name;
    this.company_type = company_type;
    this.type = type;
    this.color = color;
    this.name = CompanyTypeObj[company_type].name + `${type}`;
  }
}

@Component({
  selector: 'app-bicycle-types-comparison',
  templateUrl: './bicycle-types-comparison.component.html',
  styleUrls: ['./bicycle-types-comparison.component.less', '../bike.component.less']
})
export class BicycleTypesComparisonComponent implements OnInit, OnDestroy {

  public chartOptions: any = {};
  public chartInstance: any;

  private bicycleTypeList: Array<BicycleTypeDataItem>;

  private timerSubscription: Subscription;
  private dataSubscription: Subscription;

  @ViewChild('bicycleTypesComparisonDiv') bicycleTypesComparisonDiv: ElementRef;

  constructor(
    // private globalService: GlobalService,
    private timerService: TimerService,
    private service: BikeHttpService) {
  }

  public ngOnInit() {
    this.requestAllData();
    this.timerSubscription = this.timerService.intervalTime(REFRESH_DURATION).subscribe(() => {
      this.requestAllData();
    });
  }

  public ngOnDestroy() {
    this.timerSubscription && this.timerSubscription.unsubscribe();
    this.dataSubscription && this.dataSubscription.unsubscribe();
  }

  public onChartInit(chartInstance: any) {
    this.chartInstance = chartInstance;
  }

  private requestAllData() {
    this.dataSubscription && this.dataSubscription.unsubscribe();

    this.dataSubscription = this.service.requestBicycleTypeCountOfCompanyData()
      .subscribe(result => {
        result = result.splice(0, GlobalConst.FullScreenCompanyShowCount) || [];
        result && result.sort((itemA, itemB) => itemA.company_type - itemB.company_type);
        const typeList = [];
        for (const key in result) {
          if (result.hasOwnProperty(key)) {
            const index = Number(key);
            const item = result[index];
            if (CompanyTypeObj[item.company_type]) {
              typeList.push(new BicycleTypeDataItem(item.company_id, item.company_type, '单车',
                item.normal_count || 0, CompanyTypeObj[item.company_type].normal_color));
            }
          }
        }
        this.bicycleTypeList = typeList;
        if (this.chartInstance) {
          this.chartInstance.setOption(this.generateChart(), false);
        } else {
          this.chartOptions = this.generateChart();
        }
      }, err => {
        // this.globalService.httpErrorProcess(err);
      });
  }

  private generateChart() {
    const tooltipFormatter = (params: any) => {
      return `${params.data.company_type_name}${params.data.type}: ${params.value} (${params.percent}%)`;
    };
    const labelFormatter = (params: any) => {
      return `${params.percent}%`;
    };
    const legendFormatter = (params: any) => {
      return `${params}`;
    };
    const colors = this.bicycleTypeList.map(data => data.color);
    return EChartOptionHelper.generateOptionsOfPie(
      '单车种类情况',
      this.bicycleTypeList, tooltipFormatter, legendFormatter, labelFormatter, colors
    );
  }

}
