import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {interval} from 'rxjs';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.less']
})
export class MainHeaderComponent implements OnInit, AfterViewInit {

  public isActivePath: 'inside' | 'outside' | 'bike' | 'power' | 'security' | 'hotspot' | null = null;

  @ViewChild('date') private date: ElementRef;
  @ViewChild('time') private time: ElementRef;
  @ViewChild('week') private week: ElementRef;

  constructor(private route: Router) {
    route.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        switch (event.url) {
          case '/screen/inside':
          case '/screen/outside':
          case '/screen/bike':
          case '/screen/power':
          case '/screen/security':
          case '/screen/hotspot':
            this.isActivePath = event.url.split('/')[2] as any;
            break;
          default:
            this.isActivePath = null;
            break;
        }
      }
    });
  }

  ngOnInit(): void {
  }

  public ngAfterViewInit() {
    interval(1000).subscribe(() => this.getCurrentTime());
  }


  public onNavigationClick(path: string, event: any) {
    event.stopPropagation();
    this.route.navigate([path]);
  }

  private getCurrentTime() {
    const currentTime = new Date();
    const localDate = currentTime.toLocaleDateString(); // 年月日
    const hours = currentTime.getHours() >= 10 ? currentTime.getHours() : '0' + currentTime.getHours(); // 小时
    const minute = currentTime.getMinutes() >= 10 ? currentTime.getMinutes() : '0' + currentTime.getMinutes(); // 分
    const second = currentTime.getSeconds() >= 10 ? currentTime.getSeconds() : '0' + currentTime.getSeconds(); // 秒
    const weekArray = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    this.date.nativeElement.innerHTML = localDate;
    this.time.nativeElement.innerHTML = hours + ':' + minute + ':' + second;
    this.week.nativeElement.innerHTML = weekArray[currentTime.getDay()];
  }
}
