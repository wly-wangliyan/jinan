import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/internal/operators';

// 违规统计
export class ViolationEntity {
  public violationType;
  public violationNumbers;
  public processedViolation;

  constructor(violationType: string,
              violationNumbers: string,
              processedViolation: string) {
    this.violationType = violationType;
    this.violationNumbers = violationNumbers;
    this.processedViolation = processedViolation;
  }
}

// 运管员违规
export class TrafficControllerEntity {
  public trafficControllerName;
  public belongRoad;
  public violationType;

  constructor(trafficControllerName: string,
              belongRoad: string,
              violationType: string) {
    this.trafficControllerName = trafficControllerName;
    this.belongRoad = belongRoad;
    this.violationType = violationType;
  }
}

// 失信人员
export class DishonestEntity {
  public dishonestName;
  public dishonestTel;
  public dishonestType;

  constructor(dishonestName: string,
              dishonestTel: string,
              dishonestType: string) {
    this.dishonestName = dishonestName;
    this.dishonestTel = dishonestTel;
    this.dishonestType = dishonestType;
  }
}

// 投诉排名
export class ComplaintRankingEntity {
  public complaintRanking;
  public complaintNumbers;

  constructor(complaintRanking: string,
              complaintNumbers: string) {
    this.complaintRanking = complaintRanking;
    this.complaintNumbers = complaintNumbers;
  }
}

@Injectable({
  providedIn: 'root'
})
export class HotspotService {

  constructor() {
  }

  /**
   * 获取违规数据统计列表
   */
  requestViolationList(): Observable<Array<ViolationEntity>> {
    const violation1 = new ViolationEntity('违规停车', '711', '66');
    const violation2 = new ViolationEntity('危险驾驶', '478', '70');
    const violation3 = new ViolationEntity('占用车道', '500', '50');
    const violation4 = new ViolationEntity('违规停车', '533', '46');
    const violation5 = new ViolationEntity('危险驾驶', '300', '83');
    const violation6 = new ViolationEntity('占用车道', '325', '63');
    return of([violation1, violation2, violation3, violation4, violation5, violation6]).pipe(delay(300));
  }

  /**
   * 获取运管员违规数据统计列表
   */
  requestTrafficControllerList(): Observable<Array<TrafficControllerEntity>> {
    const violation1 = new TrafficControllerEntity('雷壮', '经七路-泺源大道', '未穿制服');
    const violation2 = new TrafficControllerEntity('尚婵', '经十路', '未穿制服');
    const violation3 = new TrafficControllerEntity('程璐宝', '经一纬二路', '收取现金');
    const violation4 = new TrafficControllerEntity('徐兴伟', '经十路', '未穿制服');
    const violation5 = new TrafficControllerEntity('敬元鑫', '经一纬二路', '服务态度差');
    const violation6 = new TrafficControllerEntity('李杨', '经七路-泺源大道', '收取现金');
    const violation7 = new TrafficControllerEntity('孟凡勇', '大纬二路', '未穿制服');
    const violation8 = new TrafficControllerEntity('周云', '历山东路', '收取现金');
    const violation9 = new TrafficControllerEntity('朱兴勇', '南辛庄路西首', '服务态度差');
    const violation10 = new TrafficControllerEntity('周婷美', '西更道路', '未穿制服');
    return of([violation1, violation2, violation3, violation4, violation5, violation6, violation7, violation8, violation9, violation10]).pipe(delay(300));
  }

  /**
   * 获取失信人员列表
   */
  requestDishonestList(): Observable<Array<DishonestEntity>> {
    const violation1 = new DishonestEntity('王正义', '186****4567', '逃费次数过多');
    const violation2 = new DishonestEntity('张武', '138****5672', '欠费超过500元');
    const violation3 = new DishonestEntity('李文斌', '182****9372', '逃费次数过多');
    const violation4 = new DishonestEntity('郑治', '135****4312', '欠费超过1000元');
    const violation5 = new DishonestEntity('赵文文', '150****2352', '逃费次数过多');
    const violation6 = new DishonestEntity('李照宝', '159****5283', '逃费次数过多');
    const violation7 = new DishonestEntity('王利多', '150****2316', '逃费次数过多');
    const violation8 = new DishonestEntity('范文', '132****7626', '逃费次数过多');
    const violation9 = new DishonestEntity('周思思', '133****9826', '逃费次数过多');
    const violation10 = new DishonestEntity('吴凯', '188****3234', '逃费次数过多');
    return of([violation1, violation2, violation3, violation4, violation5, violation6, violation7, violation8, violation9, violation10]).pipe(delay(300));
  }

  /**
   * 获取各区投诉排名列表
   */
  requestComplaintRankingList(): Observable<Array<ComplaintRankingEntity>> {
    const violation1 = new ComplaintRankingEntity('钢城区', '110');
    const violation2 = new ComplaintRankingEntity('历程区', '97');
    const violation3 = new ComplaintRankingEntity('历下区', '90');
    const violation4 = new ComplaintRankingEntity('天桥区', '88');
    const violation5 = new ComplaintRankingEntity('市中区', '83');
    const violation6 = new ComplaintRankingEntity('长清区', '70');
    const violation7 = new ComplaintRankingEntity('济阳区', '69');
    const violation8 = new ComplaintRankingEntity('章丘区', '55');
    const violation9 = new ComplaintRankingEntity('莱芜区', '42');
    const violation10 = new ComplaintRankingEntity('槐荫区', '22');
    const violation11 = new ComplaintRankingEntity('莱芜区', '21');
    const violation12 = new ComplaintRankingEntity('槐荫区', '19');
    return of([violation1, violation2, violation3, violation4, violation5, violation6, violation7, violation8,
      violation9, violation10, violation11, violation12]).pipe(delay(300));
  }
}
