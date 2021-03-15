import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {timer} from 'rxjs';
import {PlatformUserEntity, UserService} from '../../user.service';
import {ValidateHelper} from '../../../../../utils/validate-helper';
import {ElementService} from '../../../../core/element.service';
import {UserEntity} from '../../../../core/auth.service';
import {GlobalService} from '../../../../core/global.service';
import {HttpErrorEntity} from '../../../../core/http.service';

@Component({
  selector: 'app-create-platform-user',
  templateUrl: './create-platform-user.component.html',
  styleUrls: ['./create-platform-user.component.less']
})
export class CreatePlatformUserComponent implements OnInit {

  public imgError: string = null; // 图片错误信息
  public platformUser: UserEntity = new UserEntity();
  // public platformUser: PlatformUserEntity = new PlatformUserEntity();
  public nameError: boolean; // 时间错误信息
  public passwordError: boolean; // 图片错误信息
  public telError: boolean; // 图片错误信息

  private is_save = false; // 防止连续出发保存事件
  private closeCallback: any;
  private sureCallback: any;

  @ViewChild('activityPromptDiv', {static: false}) public activityPromptDiv: ElementRef;

  public formatList = [
    {key: 1, name: '路内泊车监管服务系统', isChecked: false, disabled: false},
    {key: 2, name: '路外停车监管服务系统', isChecked: false, disabled: true},
    {key: 3, name: '新能源监管服务系统', isChecked: false, disabled: true},
    {key: 4, name: '共享单车监管服务系统', isChecked: false, disabled: true},
    {key: 5, name: '热点巡查管理服务系统', isChecked: false, disabled: true},
    {key: 6, name: '智安联控监管服务系统', isChecked: false, disabled: false},
    {key: 7, name: '征信管理服务系统', isChecked: false, disabled: true},
    {key: 8, name: '就诊停车预约管理系统', isChecked: false, disabled: true},
    {key: 9, name: '资源普查管理系统', isChecked: false, disabled: true},
    {key: 10, name: '静态交通大数据展示', isChecked: false, disabled: true},
    {key: 11, name: '用户管理', isChecked: false, disabled: true}
  ];

  constructor(public promptService: ElementService, public userService: UserService,
              public globalService: GlobalService) {
  }

  ngOnInit(): void {
  }

  /**
   * 打开确认框
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open(data: UserEntity, sureFunc: any, closeFunc: any = null) {
    const openBrandModal = () => {
      timer(0).subscribe(() => {
        $(this.activityPromptDiv.nativeElement).modal('show');
      });
    };
    this.platformUser = data ? data.clone() : new UserEntity();
    this.formatList.forEach(item => {
        const index = this.platformUser.permission_ids.indexOf(item.key);
        item.isChecked = index > -1;
      });
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    this.clear();
    this.is_save = false;
    openBrandModal();
  }

  // 请求创建平台用户
  private requestActivityData() {
    const successFunc = () => {
      $(this.activityPromptDiv.nativeElement).modal('hide');
      this.sureCallback();
      this.promptService.showPromptBox('保存成功！');
    };
    this.platformUser.permission_ids = this.formatList.filter(item => item.isChecked).map(item => item.key);
    if (this.platformUser.created_time) {
      // 编辑活动
      this.userService.requestEditActivityData(this.platformUser, this.platformUser.username).subscribe(() => {
        successFunc();
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) {
          if (err.status === 422) {
            const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
            for (const content of error.errors) {
              if (content.resource === 'password' && content.code === 'missing_field') {
                this.promptService.showPromptBox('密码字段未填写！', 3);
                return;
              } else {
                this.promptService.showPromptBox('保存失败,请重试!', 3);
              }
            }
          }
        }
        this.is_save = false;
      });
    } else {
      // 新建活动
      this.userService.requestCreateActivityData(this.platformUser).subscribe(() => {
        successFunc();
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) {
          this.promptService.showPromptBox('保存失败,请重试!', 3);
        }
        this.is_save = false;
      });
    }
  }

  /**
   * 检查数据输入是否正确有效
   * @param userParams 参数信息
   * @returns {boolean}
   */
  public generateAndCheckParamsValid(userParams: UserEntity): boolean {
    this.clear();
    if (!ValidateHelper.Account(userParams.username)) {
      this.nameError = true;
      return;
    }
    if (!ValidateHelper.Password(userParams.password)) {
      this.passwordError = true;
      return;
    }
    if (!ValidateHelper.Telephone(userParams.telephone)) {
        this.telError = true;
        return;
      }
    return true;
  }

  // 提交保存
  public onSaveUser() {
    if (this.is_save) {
      return;
    }
    this.is_save = true;
    if (this.generateAndCheckParamsValid(this.platformUser)) {
      this.requestActivityData();
    }
  }

  // 权限至少选择一项
  public ifDisabled(): boolean {
      return !this.formatList.some(checkItem => checkItem.isChecked);
  }

  // 切换落地页清空跳转链接
  public clearRole() {
    this.formatList.forEach((item) => {item.isChecked = false; });
  }

  // 清空
  public clear() {
    this.nameError = false;
    this.telError = false;
    this.passwordError = false;
  }
}
