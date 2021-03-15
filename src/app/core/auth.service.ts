import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {EntityBase} from '../../utils/z-entity';
import {HttpService} from './http.service';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {GlobalConst} from '../share/global-const';

// 权限管理
export class MerchantPermissionEntity extends EntityBase {
  public merchant_permission_id: string = undefined; // 	string; T; 权限id;
  public english_name: string = undefined; // 	string; T; 权限名称(英文);
  public chinese_name: string = undefined; // string; T; 权限名称(中文);
  public sort_num: number = undefined; // int; T; 权限排序;
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间
}

// 用户权限
export class CarlinePermissionsEntity extends EntityBase {
  public carline_id: string = undefined; // 	T	权限id
  public merchant_permission: Array<MerchantPermissionEntity> = []; // Object; 关联检车线(多对多);

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'merchant_permission') {
      return MerchantPermissionEntity;
    }
    return null;
  }
}

export class UserPermissionGroupEntity extends EntityBase {
  public permission_group_id: string = undefined; // string	T	权限组id
  public english_name: string = undefined; // string	T	权限组名称(英文)
  public chinese_name: string = undefined; // string	T	权限组名称(中文)
  public is_deleted: string = undefined; // bool  T	是否刪除
  public created_time: string = undefined; // double	T	创建时间
  public updated_time: string = undefined; // double	T	更新时间
}

export class UserEntity extends EntityBase {
  public role_type = 1; // 角色类型 1:超级管理员 2：管理员3：数据运维人员4：普通用户 5：政府机关用户
  public username: string = undefined; // String	员工id
  public realname: string = undefined; // String	姓名
  public password: string = undefined; // String	密码
  public telephone: string = undefined; // Array	联系方式
  public permission_ids: Array<number> = []; // Array	权限组
  public created_time: number = undefined; // Float	创建时间

  public toAddJson(): any {
    const json = this.json();
    delete json.created_time;
    return json;
  }

  public toEditJson(): any {
    const json = this.json();
    delete json.created_time;
    delete json.password;
    delete json.username;
    return json;
  }

  // public getPropertyClass(propertyName: string): typeof EntityBase {
  //   if (propertyName === 'permission_ids') {
  //     return UserPermissionGroupEntity;
  //   }
  //   return null;
  // }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private password = 'Jtjt@123';
  private username = 'admin';

  private _isLoggedIn = false;
  // public get isLoggedIn(): boolean {
  //   return this._isLoggedIn;
  // }

  private _user: UserEntity;
  public get user(): UserEntity {
    return this._user;
  }

  public get isLoggedIn(): boolean {
    return (sessionStorage.getItem('username') === this.username) &&
      (sessionStorage.getItem('password') === this.password);
  }

  constructor(private router: Router, private httpService: HttpService) {
  }

  /**
   * 秘钥方式授权直接授权
   * @param user 当前用户
   */
  public authorizeBySecretKey(user: UserEntity) {
    this._user = user;
    this._isLoggedIn = !(user === null || user === undefined);
    // this._isLoggedIn = !isNullOrUndefined(user);
  }


  /**
   * 请求登录
   * @param username 名称
   * @param password 密码
   */
  public requestLogin(username, password): Observable<any> {
    return new Observable(observe => {
      if (username === this.username && password === this.password) {
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('password', password);
        observe.next();
      } else {
        observe.error();
      }
    });
  }

  /**
   * 登录方式授权获取用户信息
   */
  public authorizeByLogin() {
    this.httpService.get(environment.PARKING_DOMAIN + '/admin/user').subscribe(data => {
      this._user = UserEntity.Create(data.body);
      this._isLoggedIn = true;
      this.router.navigateByUrl(GlobalConst.GuidePath);
    });
  }

  /**
   * 授权失败时踢出登录状态
   */
  public kickOut() {
    this._isLoggedIn = false;
    this._user = null;
    this.router.navigate(['login']);
  }

  /**
   * 登出
   */
  public logout() {
    // this.httpService.post(environment.PARKING_DOMAIN + '/admin/logout').subscribe(() => {
    //   this._isLoggedIn = false;
    //   this._user = null;
    //   this.router.navigateByUrl(GlobalConst.LoginPath);
    // });
    this._isLoggedIn = false;
    this._user = null;
    this.router.navigateByUrl(GlobalConst.LoginPath);
  }
}
