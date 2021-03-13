import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {timer} from 'rxjs';
import {PlatformUserEntity, SystemUserEntity} from '../../user.service';
import {ElementService} from '../../../../core/element.service';
import {ValidateHelper} from '../../../../../utils/validate-helper';

@Component({
  selector: 'app-create-system-user',
  templateUrl: './create-system-user.component.html',
  styleUrls: ['./create-system-user.component.less']
})
export class CreateSystemUserComponent implements OnInit {

  public systemUser: SystemUserEntity = new SystemUserEntity();
  @ViewChild('activityPromptDiv', {static: false}) public activityPromptDiv: ElementRef;
  public test1;
  public phoneError = false; // 电话错误信息

  constructor(public promptService: ElementService) { }

  ngOnInit(): void {
  }

  /**
   * 打开确认框
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open() {
    timer(0).subscribe(() => {
      $(this.activityPromptDiv.nativeElement).modal('show');
    });
  }
  public test(e){
    console.log(e);
  }

  // 提交保存
  public onSaveUser() {
    if (this.generateAndCheckParamsValid(this.systemUser)) {
      $(this.activityPromptDiv.nativeElement).modal('hide');
    }
  }

  /**
   * 检查数据输入是否正确有效
   * @param userParams 参数信息
   * @returns {boolean}
   */
  public generateAndCheckParamsValid(userParams: SystemUserEntity): boolean {
    this.phoneError = false;
    const phoneNumbers = userParams.telephone_number.split(',');
    for (const phoneNumber of phoneNumbers) {
      if (!ValidateHelper.Phone(phoneNumber)) {
        this.phoneError = true;
        return;
      }
    }
    return true;
  }
}
