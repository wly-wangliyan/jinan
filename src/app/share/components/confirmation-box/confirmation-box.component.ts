import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-confirmation-box',
  templateUrl: './confirmation-box.component.html',
  styleUrls: ['./confirmation-box.component.less']
})
export class ConfirmationBoxComponent implements OnInit {

  @Input() public message: string; // 提示信息内容
  @Input() public title: string; // 标题名
  @Input() public sureCallback: any;
  @Input() public sureButton = '确定';

  @Output()
  closed = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  public onSure() {
    const tmp = this.sureCallback;
    tmp();
    this.closed.next();
  }

}
