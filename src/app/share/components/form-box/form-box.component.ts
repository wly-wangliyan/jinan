import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Subscription, timer} from 'rxjs';
import {NgForm} from '@angular/forms';
import {ChangePasswordParams} from '../../../pages/login/login-http.service';
import {ValidateHelper} from '../../../../utils/validate-helper';
import {ElementService} from '../../../core/element.service';
import {GlobalService} from '../../../core/global.service';

@Component({
  selector: 'app-form-box',
  templateUrl: './form-box.component.html',
  styleUrls: ['./form-box.component.less']
})
export class FormBoxComponent implements OnInit, AfterViewInit {
  public formErrors = {
    'originalPwd': '',
    'newPwd': '',
    'confirmNewPwd': '',
  };
  private sureCallback: any;

  private closeCallback: any;

  private subscription: Subscription;

  public originalPwd: string;

  public newPwd: string;

  public confirmNewPwd: string;

  public passwordPassword: ChangePasswordParams = new ChangePasswordParams();
  public repeat_password: string;



  @Input() public message: string;

  @Input() public sureName: string;

  @Input() public title: string;

  @Input() public list: Array<any> = [];
  private validationMessages = {
    'originalPwd': {
      'required': '',
    },
    'newPwd': {
      'required': '',
      'pattern': '请输入6-20位新密码'
    },
    'confirmNewPwd': {
      'required': '',
      'pattern': '请输入6-20位新密码',
    },

  };

  @ViewChild('promptDiv') public promptDiv: ElementRef;
  @ViewChild('registerForm') validateForm: NgForm;

  constructor(private elementService: ElementService, private globalService: GlobalService) {

  }

  /**
   * 模态框消失，如果有关闭回调则执行，释放订阅。
   */
  public ngAfterViewInit() {

    // 订阅表单值改变事件
    // this.validateForm.valueChanges.subscribe(data => this.onValueChanged(data));
    $(this.promptDiv.nativeElement).on('hidden.bs.modal', () => {
      if (this.closeCallback) {
        const temp = this.closeCallback;
        this.closeCallback = null;
        this.sureCallback = null;
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
        this.subscription = null;
        temp();
      }
      this.originalPwd = '';
      this.newPwd = '';
      this.confirmNewPwd = '';
    });
  }

  ngOnInit() {
    this.originalPwd = '';
    this.newPwd = '';
    this.confirmNewPwd = '';
  }


  /**
   * 确定按钮触发，判断是否有确定回调方法，有则执行。
   * */
  public submit() {
    if (this.sureCallback) {
      const temp = this.sureCallback;
      temp();
    }
  }

  /**
   * 取消按钮触发关闭模态框，释放订阅。
   * */
  public close() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.sureCallback) {
      this.closeCallback = null;
      this.sureCallback = null;
    }
    this.originalPwd = '';
    this.newPwd = '';
    this.confirmNewPwd = '';
    $(this.promptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开确认框
   * @param message 消息体
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open(title: string = '提示', message: string, sureFunc: any, sureName: string = '确定', closeFunc: any = null) {
    this.message = message;
    this.sureName = sureName;
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    this.title = title;
    timer(0).subscribe(() => {
      $(this.promptDiv.nativeElement).modal('show');
    });
  }

  public onValidFieldOriginakPwd() {
    if (this.originalPwd && this.newPwd && this.newPwd === this.originalPwd) {
      this.formErrors.newPwd += '新密码与原密码相同，请重新输入';
    }
  }

  // 自定义密码校验
  public onValidFieldPwd() {
    if (this.newPwd && this.confirmNewPwd && this.newPwd !== this.confirmNewPwd && this.formErrors.confirmNewPwd === '') {
      this.formErrors.confirmNewPwd += '两次密码不一致，请重新输入';
    } else if (this.originalPwd && this.newPwd && this.newPwd === this.originalPwd) {
      this.formErrors.newPwd += '新密码与原密码相同，请重新输入';
    }
  }

  // 表单校验方法
  onValueChanged(data) {
    for (const field of Object.keys(this.formErrors)) {
      this.formErrors[field] = '';
      // 取到表单字段
      const control = this.validateForm.form.get(field);
      // 表单字段已修改或无效
      if (control && control.dirty && !control.valid) {
        // 取出对应字段可能的错误信息
        const messages = this.validationMessages[field];
        // 从errors里取出错误类型，再拼上该错误对应的信息
        for (const key of Object.keys(control.errors)) {
          this.formErrors[field] += messages[key] + '';
        }
      }
    }
  }

  public onModifyPwdFormSubmit() {
    if (!ValidateHelper.Length(this.originalPwd, 8, 20)) {
      this.elementService.showPromptBox('原始密码输入错误!', 2);
      return;
    } else if (!ValidateHelper.Length(this.newPwd, 8, 20)) {
      this.elementService.showPromptBox('新密码输入错误!', 2);
      return;
    } else if (this.newPwd !== this.confirmNewPwd) {
      this.elementService.showPromptBox('两次密码不一致，请重新输入！', 2);
      return;
    } else if (this.originalPwd === this.newPwd) {
      this.elementService.showPromptBox('新旧密码不可相同！', 2);
    } else {
      // this.globalService.changePwd(this.originalPwd, this.confirmNewPwd);
        if (this.sureCallback) {
          const temp = this.sureCallback;
          temp();
        }
    }
  }
}

