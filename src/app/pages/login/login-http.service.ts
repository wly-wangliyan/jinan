import {Injectable} from '@angular/core';
import {EntityBase} from '../../../utils/z-entity';
import {environment} from "../../../environments/environment";
import {HttpService} from "../../core/http.service";

export class ChangePasswordParams extends EntityBase {
  public old_password: string = undefined;	 // T	原始密码
  public new_password: string = undefined;	// T	新密码
}

export class LoginParams extends EntityBase {
  public username: string = undefined;	 // T	用户账号
  public password: string = undefined;	// T	用户密码
}



@Injectable({
  providedIn: 'root'
})
export class LoginHttpService {

  private domain = environment.PARKING_DOMAIN;

  constructor(private httpService: HttpService) {
  }

  // 登录
  public requestLogin(params: LoginParams) {
    const httpUrl = `${this.domain}/admin/login`;
    // const httpUrl = `${this.domain}/login`;
    const body = params.json();
    return this.httpService.postFormData(httpUrl, body);
  }
}
