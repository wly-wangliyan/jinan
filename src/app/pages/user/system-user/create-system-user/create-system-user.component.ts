import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Subject, Subscription, timer} from 'rxjs';
import {PlatformUserEntity, SearchEmployeeParams, SystemUserEntity, UserService} from '../../user.service';
import {ElementService} from '../../../../core/element.service';
import {ValidateHelper} from '../../../../../utils/validate-helper';
import {debounceTime} from "rxjs/internal/operators";
import {switchMap} from "rxjs/operators";
import {UserEntity} from "../../../../core/auth.service";
import {GlobalService} from "../../../../core/global.service";



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
  public usersList: Array<UserEntity> = [];
  private closeCallback: any;
  private sureCallback: any;
  private is_save = false; // 防止连续出发保存事件



  constructor(public promptService: ElementService, private userService: UserService,private globalService: GlobalService) { }

  ngOnInit(): void {

  }

  /**
   * 打开确认框
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  /**
   * 打开确认框
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open(data: SystemUserEntity, sureFunc: any, closeFunc: any = null) {
    const openBrandModal = () => {
      timer(0).subscribe(() => {
        $(this.activityPromptDiv.nativeElement).modal('show');
      });
    };
    this.systemUser = data ? data.clone() : new SystemUserEntity();
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    this.clear();
    this.is_save = false;
    openBrandModal();
  }

  // 提交保存
  public onSaveUser() {
    if (this.generateAndCheckParamsValid(this.systemUser)) {
      this.requestSystemData();
    }
  }

  // 请求创建平台用户
  private requestSystemData() {
    const successFunc = () => {
      $(this.activityPromptDiv.nativeElement).modal('hide');
      this.sureCallback();
      this.promptService.showPromptBox('保存成功！');
    };
    if (this.systemUser.id) {
      // 编辑活动
      this.userService.requestEditSystemData(this.systemUser.company_name, this.systemUser).subscribe(() => {
        successFunc();
      }, err => {
        this.promptService.showPromptBox('保存失败！');
        this.globalService.httpErrorProcess(err);
      });
    } else {
      // 新建活动
      this.userService.requestCreateSystemData(this.systemUser).subscribe(() => {
        successFunc();
      }, err => {
        this.promptService.showPromptBox('保存失败！');
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  // 清空
  public clear() {
    this.phoneError = false;
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
