import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {EntityBase} from '../../utils/z-entity';
import {HttpService} from "./http.service";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {GlobalConst} from "../share/global-const";

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

// 用户信息
export class MerchantUserEntity extends EntityBase {
  public merchant_user_id: string = undefined; // string 	主键
  public username: string = undefined; // string	用户账号主键
  public realname: string = undefined; // string; 员工姓名; / 真实姓名;
  public telephone: string = undefined; //  string; 手机号;
  public company_id: string = undefined; // 企业ID
  public compony_name: string = undefined; // 企业名称
  public updated_time: number; // float; 更新时间;
  public created_time: number; // float; 创建时间;
  public carline_permissions: Array<CarlinePermissionsEntity> = []; // Object;
  public is_active = false; // boolean True: 可用; False: 已删除;
  public mer_employee_management = false; // boolean True: 可用; False: 已删除;
  public is_super = false; // boolean True: 可用; False: 已删除;

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'carline_permissions') {
      return CarlinePermissionsEntity;
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
  public role: string = undefined; // 角色 1:平台用户 2: 系统厂商 3: 物业公司
  public username: string = undefined; // String	员工id
  public realname: string = undefined; // String	姓名
  public password: string = undefined; // String	姓名
  public telephone: string = undefined; // Array	联系方式
  public email: string = undefined; // String	邮箱
  public permission_groups: Array<UserPermissionGroupEntity> = undefined; // Array	权限组
  public department: string = undefined; // String	部门
  public remarks: string = undefined; // String	备注
  public updated_time: number = undefined; // Float	更新时间
  public created_time: number = undefined; // Float	创建时间
  public is_superuser: boolean = undefined; // 是否为管理员
  public show_terminal: string = ''; // 1小程序 2APP

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'permission_groups') {
      return UserPermissionGroupEntity;
    }
    return null;
  }
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
