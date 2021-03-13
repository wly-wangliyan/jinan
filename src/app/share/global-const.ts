export class GlobalConst {
  public static readonly UIPageSize = 15;
  public static readonly LoginPath = '/login';
  public static readonly HomePath = '/screen';
  public static readonly GuidePath = '/guide';
  public static readonly RegionID = '370101'; // 当前版本的城市信息
  public static readonly RegionCenter = [117.024967066, 36.6827847272]; // 当前版本的城市中心点经纬度
  public static readonly RegionBoundSouthWest = [114.819254, 34.377352]; // 当前版本边界的西南点经纬度
  public static readonly RegionBoundNorthEast = [122.71596, 38.402247]; // 当前版本边界的东北点经纬度
  /**
   * 目前大屏默认有且只有3个企业(青桔、哈罗、美团)
   */
  public static readonly FullScreenCompanyShowCount = 3;
}
