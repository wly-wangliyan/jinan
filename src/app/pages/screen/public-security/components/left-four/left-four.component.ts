import { Component, OnInit } from '@angular/core';
import { mockData } from '../../mock-data';

@Component({
  selector: 'app-left-four',
  templateUrl: './left-four.component.html',
  styleUrls: ['./left-four.component.less']
})
export class LeftFourComponent implements OnInit {

  public chartOptions: any;

  public chartInstance: any;

  constructor() {
  }

  ngOnInit(): void {
    this.generateCharts();
  }

  public onChartInit(chartInstance: any): void {
    this.chartInstance = chartInstance;
  }

  private generateCharts(): void {

    this.chartOptions = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        bottom: '12%',
        data: ['政区', '景区', '站区', '校圈', '医圈', '商圈'],
        textStyle: {
          color: '#BFE8FF',
          fontSize: 14
        },
        itemWidth: 10,
        itemHeight: 10
      },
      series: [
        {
          name: '车位预约',
          type: 'pie',
          radius: '55%',
          center: ['50%', '40%'],
          roseType: 'radius',
          label: {
            color: '#fff',
            fontSize: 14,
            fontWeight: 'bold',
            formatter: '{b}:{d}%',
          },
          data: mockData.spotReservation
        }
      ],
      color: ['#42E0FC', '#A4E5FF', '#4E7CD9', '#4EBA92', '#0091FF', '#81FF5D']
    };
    this.chartInstance && this.chartInstance.setOption(this.chartOptions, true);
  }

}
