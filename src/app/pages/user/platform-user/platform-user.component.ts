import {Component, OnInit, ViewChild} from '@angular/core';
import {GlobalService} from '../../../core/global.service';
import {FormBoxComponent} from '../../../share/components/form-box/form-box.component';
import {ElementService} from '../../../core/element.service';
import {CreatePlatformUserComponent} from './create-platform-user/create-platform-user.component';
import {Subject, timer} from 'rxjs';
import {UserEntity} from '../../../core/auth.service';
import {debounceTime} from "rxjs/internal/operators";
import {switchMap} from "rxjs/operators";
import {PlatformUserEntity, SearchEmployeeParams, UserService} from "../user.service";
import {Subscription} from "rxjs/index";

const PageSize = 10;

@Component({
  selector: 'app-platform-user',
  templateUrl: './platform-user.component.html',
  styleUrls: ['./platform-user.component.less']
})
export class PlatformUserComponent implements OnInit {

  @ViewChild('createPlatformUser', {static: false}) public createPlatformUser: CreatePlatformUserComponent;

  public usersList: Array<UserEntity> = [];
  private searchText$ = new Subject<any>();
  public noResultText = '数据加载中...';
  public searchParams = new SearchEmployeeParams();
  public pageSize = 10; // 与列表中pageSize保持一致，用于计算序号
  public pageIndex = 1;
  private linkUrl: string;
  private continueRequestSubscription: Subscription;

  private get pageCount(): number {
    if (this.usersList.length % PageSize === 0) {
      return this.usersList.length / PageSize;
    }
    return this.usersList.length / PageSize + 1;
  }

  @ViewChild(FormBoxComponent) public formBox: FormBoxComponent;

  constructor(private globalService: GlobalService, public promptService: ElementService,
              private userService: UserService) {
    this.searchParams.page_size = PageSize * 3;
  }

  ngOnInit() {
    // 员工管理列表
    this.searchText$.pipe(
        debounceTime(500),
        switchMap(() =>
            this.userService.requestUsersList(this.searchParams))
    ).subscribe(res => {
      this.usersList = res;
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
  }

  public onChangeCompanyTypeSearch(e) {
    console.log(e);
  }

  public onNZPageIndexChange(pageIndex: number) {
    console.log('yy');
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.userService.continueUsersList(this.linkUrl).subscribe(res => {
        this.usersList = this.usersList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  // 查询按钮
  public onSearchBtnClick() {
    this.searchParams.realname = this.searchParams.realname.trim();
    this.searchText$.next();
    // tslint:disable-next-line:no-unused-expression
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 点击新建、编辑弹出
  public onShowModal(data: UserEntity = new UserEntity()) {
    this.createPlatformUser.open(data, () => {
      this.createPlatformUser.clear();
      timer(0).subscribe(() => {
        this.searchText$.next();
      });
    });
  }

  // 删除员工
  public onDeleteUser(dataItem: UserEntity) {
    this.promptService.showConfirmBox('确认删除该员工，此操作不可恢复！', '删除用户', () => {
      // this.globalService.confirmationBox.close();
      this.userService.requestDeleteUser(dataItem.username).subscribe(() => {
        this.searchText$.next();
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }, '删除');
  }

  // 重置密码
  public onResetPassword(dataItem: UserEntity) {
    this.promptService.showConfirmBox('请确认是否要重置密码？', '密码重置', () => {
      this.userService.requestResetPassword(dataItem.username).subscribe(() => {
        this.promptService.showPromptBox(' 密码重置成功，新密码已下发到员工邮箱！');
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
      // console.log('888');
    });
  }

  // 停用用户
  public onStopUser() {
    this.promptService.showConfirmBox('请确认是否停用用户XX？', '删除用户', () => {
      console.log('888');
    });
  }
}
