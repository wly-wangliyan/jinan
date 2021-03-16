import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subscription, timer} from 'rxjs';

@Component({
  selector: 'app-prompt-box',
  templateUrl: './prompt-box.component.html',
  styleUrls: ['./prompt-box.component.less'],
})
export class PromptBoxComponent implements OnInit, AfterViewInit {

  @Input() message: string; // 提示信息
  @Input() imgStatus: number; // 提示icon，1成功 2失败 3警告
  @Input() callback: any; // 确认回调函数

  private delaySubscription: Subscription;

  @Output()
  closed = new EventEmitter();

  private state: 'opened' | 'closed' = 'closed';

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.delaySubscription = timer(2000).subscribe(() => {
      this.closed.next();
      if (this.callback) {
        const temp = this.callback;
        this.callback = null;
        if (this.delaySubscription) {
          this.delaySubscription.unsubscribe();
        }
        temp();
      }
    });
  }

  // 关闭提示框
  public close() {
    this.closed.next();
    this.delaySubscription && this.delaySubscription.unsubscribe();
  }


}
