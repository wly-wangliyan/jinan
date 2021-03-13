export class BarSeriesItem {
  public name: any;
  public barWidth: number; // 柱宽度
  public barBorderRadius: Array<number> = [0, 0, 0, 0]; // 柱圆角
  public chartY: Array<number> = [];
  public color: string;
}

export class LineSeriesItem {
  public name: any;
  public chartY: Array<number> = [];
  public color: string;
}

export class PieDataItem {
  public name: string; // 名称
  public value: number; // 数量
  public color: string; // 颜色
}

export class EChartOptionHelper {
  public static generateBarSeriesData(name: any, chartY: any, barWidth: number, color: string): BarSeriesItem {
    const series = new BarSeriesItem();
    series.name = name;
    series.barWidth = barWidth;
    series.chartY = chartY;
    series.color = color;
    return series;
  }

  public static generateLineSeriesData(name: any, chartY: any, color: string): LineSeriesItem {
    const series = new LineSeriesItem();
    series.name = name;
    series.chartY = chartY;
    series.color = color;
    return series;
  }

  // 柱状图数据源
  public static generateOptionsOfBar(
    subtext: string,
    chartX: Array<any>,
    tooltipFormatter: any,
    seriesList: Array<any>,
    sourceSize: 'superlg' | 'lg' | 'sm' = 'sm'): any {
    const multiple = sourceSize === 'superlg' ? 2 : 1;
    const chartOptions = {
      title: {
        subtext, // 纵坐标含义
        subtextStyle: {
          color: '#00FFD6',
          fontSize: 12 * multiple,
          fontFamily: 'Source Han Sans SC',
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        confine: true, // 是否将 tooltip 框限制在图表的区域内。
        formatter: tooltipFormatter,
        textStyle: {
          fontFamily: 'Source Han Sans SC',
        },
      },
      grid: {
        bottom: 20,
        left: 10,
        containLabel: true,
      },
      legend: {
        icon: 'rect',
        data: seriesList.map(item => item.name),
        right: 10,
        top: 10 / multiple,
        itemWidth: 8 * multiple,
        itemHeight: 8 * multiple,
        textStyle: {
          color: '#C8EBFF',
          fontSize: 12 * multiple,
          fontFamily: 'Source Han Sans SC',
        },
      },
      calculable: true,
      xAxis: [
        {
          offset: 5,
          type: 'category',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#3969F3',
              width: multiple * 1
            }
          },
          axisTick: {
            show: false,
            alignWithLabel: true,
          },
          axisLabel: {
            color: '#C8EBFF',
            fontSize: 12 * multiple
          },
          data: chartX
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#3969F3',
              width: multiple * 1
            }
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#C8EBFF',
            fontSize: 12 * multiple
          },
          splitLine: {
            show: false
          },
          splitNumber: 3,
          minInterval: 1,
        }
      ],
      series: seriesList.map(series => ({
        ...series,
        data: series.chartY,
        type: 'bar',
        barWidth: series.barWidth,
        itemStyle: {
          barBorderRadius: series.barBorderRadius,
          color: series.color
        }
      }))
    };
    return chartOptions;
  }

  // 饼状图数据源
  public static generateOptionsOfPie(
    name: any,
    chartData: Array<any>,
    tooltipFormatter: any,
    legendFormatter: any,
    labelFormatter: any,
    colors: Array<string>,
    sourceSize: 'superlg' | 'lg' | 'sm' = 'sm') {
    const multiple = sourceSize === 'superlg' ? 2 : 1;

    return {
      textStyle: {
        fontFamily: 'Source Han Sans SC',
      },
      tooltip: {
        trigger: 'item',
        formatter: tooltipFormatter,
        textStyle: {
          color: '#fff',
          fontSize: 14,
          fontWeight: 'normal',
          // fontFamily: 'Source Han Sans SC; '
        }
      },
      legend: {
        show: true,
        formatter: legendFormatter,
        orient: 'vertical',
        right: 30,
        top: '38%',
        textStyle: {
          color: '#fff',
          fontWeight: 'normal',
        },
      },
      series: [
        {
          name,
          type: 'pie',
          radius: ['25%', '50%'],
          center: ['35%', '50%'],
          data: chartData,
          label: {
            show: true,
            formatter: labelFormatter,
            color: '#fff',
            fontWeight: 'bold',
          },
          labelLine: {
            show: true,
            length: multiple * 5,
            length2: multiple * 10,
          },
        }
      ],
      color: colors
    };
  }

  // 折线图
  public static generateOptionsOfLine(
    yAxisName: string,
    xAxisData: Array<any>,
    xAxisName: any,
    tooltipFormatter: any,
    seriesList: Array<any>,
    sourceSize: 'superlg' | 'lg' | 'sm' = 'sm'): any {
    const multiple = sourceSize === 'superlg' ? 2 : 1;
    return {
      // title: {
      //   subtext,
      //   subtextStyle: {
      //     color: '#8399AA',
      //     fontSize: 12 * multiple
      //   },
      // },
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'line' // 默认为直线，可选为：'line' | 'shadow'
        },
        confine: true, // 是否将 tooltip 框限制在图表的区域内。
        formatter: tooltipFormatter,
        textStyle: {
          fontFamily: 'Source Han Sans SC',
        },
      },
      legend: {
        icon: 'circle',
        type: 'scroll',
        data: seriesList.map(item => item.name),
        textStyle: {
          color: '#8399AA',
          fontSize: 14 * multiple,
          fontFamily: 'Source Han Sans SC',
        },
        right: '2%',
        top: 10 / multiple,
        itemGap: 30,
        itemWidth: 12,
        itemHeight: 12,
      },
      grid: {
        left: '4%',
        right: '5%',
        bottom: 20,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        nameGap: 5,
        data: xAxisData,
        name: xAxisName,
        nameTextStyle: {
          color: '#8399AA',
          fontSize: 18 * multiple,
          padding: [0, 5],
          fontFamily: 'Source Han Sans SC',
        },
        boundaryGap: false,
        axisTick: {
          show: false,
          alignWithLabel: true,
        },
        axisLabel: {
          color: '#8399AA',
          fontSize: 18 * multiple
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#E6E8F2',
            width: multiple * 1
          }
        },
      },
      yAxis: {
        type: 'value',
        name: yAxisName,
        nameTextStyle: {
          color: '#8399AA',
          fontSize: 18 * multiple,
          padding: [0, 5],
          fontFamily: 'Source Han Sans SC',
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#E6E8F2',
            width: multiple * 1
          }
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#8399AA',
          fontSize: 18 * multiple
        },
        splitLine: {
          lineStyle: {
            color: ['#E6E8F2'],
            type: 'dashed'
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['#fff', '#fff']
          },
          opacity: 0.5
        }
      },
      series: seriesList.map(series => ({
        ...series,
        data: series.chartY,
        type: 'line',
        itemStyle: {
          color: series.color
        },
        symbolSize: multiple * 4,
        lineStyle: {
          width: multiple * 2
        }
      }))
    };
  }
}
