import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import {FormBoxComponent} from '../share/components/form-box/form-box.component';
import {HttpErrorEntity, HttpService} from './http.service';
import {Http403PageComponent} from '../share/components/http-403-page/http-403-page.component';
import {Http500PageComponent} from '../share/components/http-500-page/http-500-page.component';
import {ElementService} from './element.service';
import {timer} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  // 特殊存储，全局化资源配置
  public static Instance: GlobalService;
  public http500Tip: Http500PageComponent;
  public http403Tip: Http403PageComponent;

  constructor(private authService: AuthService, private httpService: HttpService, private elementService: ElementService) {
  }


  public formBox: FormBoxComponent;

  private permissionErrorMessage = '授权失败，请重新登录！';

  private networkErrorMessage = '服务器内部错误，请稍后重试！';


  /**
   * 获取当前服务器时间戳(秒）
   * @returns number
   */
  public get timeStamp(): number {
    return this.httpService.timeStamp;
  }

  // /**
  //  * 网络错误处理函数
  //  * @param err 错误信息
  //  * @returns boolean 是否处理了错误信息，未处理则返回false
  //  */
  // public httpErrorProcess(err: HttpErrorResponse): boolean {
  //   // if (err.status === 403) {
  //   //   this.http403Tip.http403Flag = true;
  //   //   this.promptBox.open(this.permissionErrorMessage, () => {
  //   //     this.authService.kickOut();
  //   //   }, 'warning');
  //   //   return true;
  //   // } else if (err.status === 500) {
  //   //   this.http500Tip.http500Flag = true;
  //   //   // this.promptBox.open(this.networkErrorMessage, null, 'warning');
  //   //   return true;
  //   // } else {
  //   //   console.error(err);
  //   return false;
  //   // }
  // }

  /**
   * 网络错误处理函数
   * @param err 错误信息
   * @returns boolean 是否处理了错误信息，未处理则返回false
   */
  public httpErrorProcess(err: HttpErrorResponse): boolean {
    if (err.status === 403) {
      this.http403Tip.http403Flag = true;
      this.elementService.showPromptBox(this.permissionErrorMessage, 3, () => {
        this.authService.kickOut();
      });
      return true;
    } else if (err.status === 500) {
      this.http500Tip.http500Flag = true;
      return true;
    } else {
      console.error(err);
      return false;
    }
  }

  /**
   * 修改密码
   */
  public changePwd(originalPwd, confirmNewPwd) {
    console.log(originalPwd, confirmNewPwd);
    this.httpService.put(environment.PARKING_DOMAIN + `/users/change_password`, {
      old_password: originalPwd,
      new_password: confirmNewPwd
    }).subscribe(() => {
      this.elementService.showPromptBox('密码修改成功!');
      this.formBox.close();
      timer(2000).subscribe(() => {
        this.authService.kickOut();
      });
    }, err => {
      if (!this.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            const field = content.field === 'old_password' ? '原始密码' : content.field === 'password' ? '新密码' : '确认新密码';
            if (content.code === 'missing_field') {
              this.elementService.showPromptBox(`${field}字段缺失！`, 2);
              return;
            } else if (content.code === 'invalid') {
              if (content.field === 'old_password') {
                this.elementService.showPromptBox('原密码输入错误', 3);
              } else {
                this.elementService.showPromptBox(`${field}输入错误！`, 3);
              }
            } else {
              this.elementService.showPromptBox('密码修改失败，请重试!', 3);
            }
          }
        }
      }
    });
  }
}
