import {EventEmitter, Injectable} from '@angular/core';
import {interval, Observable, Subscription} from 'rxjs';

const MIN_TILE = 5; // 最小间隔数

export const REFRESH_DURATION = 10 * 60 * 1000;

interface ITimer {
  [key: number]: EventEmitter<any>;
}

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  private count = 0;
  private timerSubscription: Subscription;
  private timers: ITimer = {};

  constructor() {
    this.startTimer();
  }

  /**
   * 间隔固定时间发射信号
   * @param ms 需要循环的秒数(必须是5的倍数，最小值为5)
   */
  public intervalTime(ms: number): Observable<any> {
    if ((ms < MIN_TILE) || (ms % MIN_TILE !== 0)) {
      throw new Error('min_tile_error,to see method annotation. by zack');
    }
    if (!this.timers[ms]) {
      this.timers[ms] = new EventEmitter();
    }
    return this.timers[ms].asObservable();
  }

  /**
   * 启动timer
   */
  public startTimer() {
    this.timerSubscription && this.timerSubscription.unsubscribe();
    this.timerSubscription = interval(1000 * MIN_TILE).subscribe(() => {
      // 每5s触发一次数据刷新
      this.count += MIN_TILE;
      for (const ms in this.timers) {
        if (this.count % (Number(ms) / 1000) === 0) {
          if (this.timers[ms].observers.length === 0) {
            delete this.timers[ms];
          } else {
            this.timers[ms].emit();
          }
        }
      }
    });
  }

  /**
   * 停止timer
   */
  public stopTimer() {
    this.timerSubscription && this.timerSubscription.unsubscribe();
  }
}
