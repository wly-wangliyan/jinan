class MockData {
  // 社区接入排行榜
  public communityAccessRankingList = [
    {name: '钢城区', value: 36},
    {name: '历程区', value: 38},
    {name: '历下区', value: 19},
    {name: '天桥区', value: 16},
    {name: '市中区', value: 44},
    {name: '长清区', value: 32},
    {name: '济阳区', value: 21},
    {name: '章丘区', value: 17},
    {name: '莱芜区', value: 15},
    {name: '槐荫区', value: 22},
    {name: '平阴县', value: 10},
    {name: '商河县', value: 8}
  ];
  // 共享车位数列表
  public shareSpotCountList = [
    {name: '钢城区', value: 210},
    {name: '历程区', value: 180},
    {name: '历下区', value: 193},
    {name: '天桥区', value: 170},
    {name: '市中区', value: 168},
    {name: '长清区', value: 172},
    {name: '济阳区', value: 111},
    {name: '章丘区', value: 140},
    {name: '莱芜区', value: 125},
    {name: '槐荫区', value: 100},
    {name: '平阴县', value: 55},
    {name: '商河县', value: 35}
  ];

  // 车辆高峰分析
  public carPeakAnalysis = {
    entrance: [800, 500, 600, 700, 400, 550, 700],
    exit: [500, 600, 550, 450, 650, 550, 600],
  };

  // 车位预约
  public spotReservation = [
    {value: 38, name: '政区'},
    {value: 22, name: '商圈'},
    {value: 12, name: '站区'},
    {value: 12, name: '校圈'},
    {value: 8, name: '医圈'},
    {value: 8, name: '景区'},
  ];

  // 社区停车利用率
  public communityUtilizationRate = {
    totalCount: 666,
    surplusCount: 321,
    rates: [
      {
        name: '',
        data: [20, 40, 50, 45, 70, 90]
      },
      {
        name: '花园路社区',
        data: [0, 3, 10, 5, 7, 15]
      },
      {
        name: '袁庄社区',
        data: [5, 7, 10, 9, 3, 15]
      },
      {
        name: '田庄社区',
        data: [5, 10, 10, 6, 20, 20]
      },
      {
        name: '新城社区',
        data: [3, 5, 10, 15, 10, 15]
      },
      {
        name: '洋涓社区',
        data: [7, 10, 6, 9, 16, 20]
      },
      {
        name: '美里花园社区',
        data: [0, 5, 4, 1, 14, 5]
      },
    ]
  };

  // 在线预警，车辆预警
  public earlyWarning = {
    online: 78,
    car: 66
  };

  // 车辆进出场列表
  public vehicleAccessList = [
    {
      name: '伟东新都', car_id: '鲁A207V7', entrance_time: '06:38:35', exit_time: '09:20:06'
    },
    {
      name: '中润世纪城', car_id: '鲁A215NX', entrance_time: '07:28:05', exit_time: '20:55:20'
    },
    {
      name: '鲁能领秀城', car_id: '鲁A162LV', entrance_time: '10:22:05', exit_time: '19:50:04'
    },
    {
      name: '阳光100', car_id: '鲁A763MQ', entrance_time: '11:18:15', exit_time: '14:44:44'
    },
    {
      name: '锦绣泉城', car_id: '鲁A9F16Z', entrance_time: '08:28:05', exit_time: '10:33:20'
    },
    {
      name: '花园路社区', car_id: '鲁A30717', entrance_time: '12:16:15', exit_time: '08:50:20'
    },
    {
      name: '袁庄社区', car_id: '鲁A235PX', entrance_time: '14:28:05', exit_time: '20:35:20'
    },
    {
      name: '田庄社区', car_id: '鲁A762L1', entrance_time: '10:19:05', exit_time: '18:50:04'
    },
    {
      name: '新城社区', car_id: '鲁A89QW1', entrance_time: '14:18:15', exit_time: '14:44:44'
    },
    {
      name: '洋涓社区', car_id: '鲁A99F16', entrance_time: '17:28:05', exit_time: '18:13:20'
    },
  ];

  // 周边停车资源分析
  public parkingSourceAnalysis = [
    {
      name: '按察司街社区', parking_name: '按察司街社区-停车场', parking_type: '配建停车场', spot: 768
    },
    {
      name: '南康社区', parking_name: '南康社区停车场', parking_type: '配建停车场', spot: 555
    },
    {
      name: '甸柳庄社区', parking_name: '甸柳庄社区停车场', parking_type: '配建停车场', spot: 85
    },
    {
      name: '李庄社区', parking_name: '李庄社区停车场', parking_type: '配建停车场', spot: 156
    },
    {
      name: '南徐社区', parking_name: '南徐社区停车场', parking_type: '配建停车场', spot: 436
    },
    {
      name: '济南绿园小区', parking_name: '济南绿园小区停车场', parking_type: '配建停车场', spot: 1568
    },
    {
      name: '香磨李社区', parking_name: '香磨李社区南侧地上停车场', parking_type: '配建停车场', spot: 684
    },
    {
      name: '北村社区', parking_name: '北村社区停车场', parking_type: '配建停车场', spot: 938
    },
    {
      name: '北康社区', parking_name: '北康社区停车场', parking_type: '配建停车场', spot: 864
    },
    {
      name: '鑫达小区', parking_name: '鑫达小区停车场', parking_type: '配建停车场', spot: 1324
    },
    {
      name: '中海国际社区', parking_name: '中海国际社区停车场', parking_type: '配建停车场', spot: 1892
    },
    {
      name: '南全福小区', parking_name: '南全福小区停车场', parking_type: '配建停车场', spot: 386
    },
    {
      name: '伟东新都', parking_name: '伟东新都停车场', parking_type: '配建停车场', spot: 123
    },
    {
      name: '中润世纪城', parking_name: '中润世纪城停车场', parking_type: '配建停车场', spot: 458
    },
    {
      name: '鲁能领秀城', parking_name: '鲁能领秀城停车场', parking_type: '配建停车场', spot: 940
    },
    {
      name: '阳光100', parking_name: '阳光100停车场', parking_type: '配建停车场', spot: 256
    },
    {
      name: '锦绣泉城', parking_name: '锦绣泉城停车场', parking_type: '配建停车场', spot: 785
    },
    {
      name: '花园路社区', parking_name: '花园路社区停车场', parking_type: '配建停车场', spot: 420
    },
    {
      name: '袁庄社区', parking_name: '袁庄社区停车场', parking_type: '配建停车场', spot: 689
    },
    {
      name: '田庄社区', parking_name: '田庄社区停车场', parking_type: '配建停车场', spot: 132
    },
    {
      name: '新城社区', parking_name: '新城社区停车场', parking_type: '配建停车场', spot: 453
    },
    {
      name: '洋涓社区', parking_name: '洋涓社区停车场', parking_type: '配建停车场', spot: 947
    },
  ];
}

export const mockData = new MockData();
