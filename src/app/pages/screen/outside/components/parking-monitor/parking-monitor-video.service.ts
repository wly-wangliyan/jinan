import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DateFormatHelper } from 'src/utils/date-format-helper';
import { isNullOrUndefined } from 'util';

@Injectable()
export class ParkingMonitorVideoService {

  public get isLoading() {
    return this.isVideoLoading;
  }

  private isVideoLoading = false; // 标记是否成功加载了视频

  private decoder: any;

  /** 重置播放器尺寸 */
  public reSize() {
    this.decoder.reSize(window.innerWidth - 100, 610);
  }


  // 关闭播放器
  public stop(): Observable<any> {
    console.log('开始关闭播放器...');
    this.isVideoLoading = false;
    // The play() request was interrupted by a call to pause()
    return timer(150).pipe(switchMap(() => new Observable(observe => {
      if (isNullOrUndefined(this.decoder)) {
        console.log('已关闭播放器null...');
        observe.next();
        observe.complete();
        return;
      }
      this.decoder.stop().then(() => {
        console.log('已关闭播放器stop...');
        observe.next();
        observe.complete();
      }).catch(err => {
        console.log('关闭播放器失败：', err);
        observe.next();
        observe.complete();
      });
    })));
  }

  /**
   * 播放器
   * @param url 监控地址
   * @param token 播放token
   * @param widthSize 视频宽度
   * @param heightSize 视频高度
   */
  public play(url: string, token: string, splitBasis: number = 1, widthSize: number = 850, heightSize: number = 650) {
    this.stop().subscribe(() => {
      this.isVideoLoading = false;
      console.log('正在加载视频...');
      // const url = `ezopen://open.ys7.com/227725890/1.live,ezopen://open.ys7.com/227725890/1.live`;
      console.log(EZUIKit);
      this.decoder = new EZUIKit.EZUIPlayer({
        id: 'live',
        autoplay: true,
        url,
        accessToken: token,
        decoderPath: '/assets/libs/js/ezuikit',
        width: widthSize,
        height: heightSize,
        splitBasis: splitBasis,
        handleError: this.handleError,
        handleSuccess: this.handleSuccess,
      });
      this.decoder.on('log', this.log);
    });
  }

  private handleError = (e) => {
    console.log('捕捉到错误：', e);
    this.stop().subscribe();
  }

  private handleSuccess = (e) => {
    // 播放成功回调函数，此处可执行播放成功后续动作
    this.isVideoLoading = true;
  }

  // 打印日志
  private log = (str) => {
    const logInfo = DateFormatHelper.Format(DateFormatHelper.Now, 'yyyy-MM-dd hh:mm:ss') + ' ' + JSON.stringify(str);
    console.log(logInfo);
  }
}
