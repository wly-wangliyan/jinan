import {Injectable} from '@angular/core';
import {EntityBase} from '../../../utils/z-entity';
import {environment} from '../../../environments/environment';
import {HttpService} from '../../core/http.service';

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
    const httpUrl = `${this.domain}/login`;
    // const httpUrl = `${this.domain}/login`;
    const body = params.json();
    return this.httpService.postFormData(httpUrl, body);
  }

  // /**
  //  * 请求登录
  //  * @param username 名称
  //  * @param password 密码
  //  * @returns Observable<LoginResultEntity>
  //  */
  // public requestLogin(params: LoginParams): Observable<LoginResultEntity> {
  //   const body = {
  //     username: params.username,
  //     password: params.password,
  //   };
  //   return this.httpService.postFormData(environment.CIPP_UNIVERSE + '/login', body)
  //     .pipe(map(data => LoginResultEntity.Create(data.body)));
  // }
}
