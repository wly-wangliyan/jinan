import {Component, OnInit, ViewChild} from '@angular/core';
import {ElementService} from '../../../core/element.service';
import {CreateSystemUserComponent} from './create-system-user/create-system-user.component';
import {debounceTime} from 'rxjs/internal/operators';
import {switchMap} from 'rxjs/operators';
import {Subject, Subscription, timer} from 'rxjs';
import {GlobalService} from '../../../core/global.service';
import {SearchSystemParams, SystemUserEntity, UserService} from '../user.service';

const PageSize = 10;

@Component({
  selector: 'app-system-user',
  templateUrl: './system-user.component.html',
  styleUrls: ['./system-user.component.less']
})
export class SystemUserComponent implements OnInit {

  @ViewChild('createSystemUser', {static: false}) public createSystemUser: CreateSystemUserComponent;


  public noResultText = '数据加载中...';
  public usersList: Array<SystemUserEntity> = [];
  public pageSize = 10; // 与列表中pageSize保持一致，用于计算序号
  public pageIndex = 1;
  public searchParams = new SearchSystemParams();
  private linkUrl: string;
  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;

  private get pageCount(): number {
    if (this.usersList.length % PageSize === 0) {
      return this.usersList.length / PageSize;
    }
    return this.usersList.length / PageSize + 1;
  }

  constructor(public promptService: ElementService, private globalService: GlobalService,
              private userService: UserService) {
    this.searchParams.page_size = PageSize * 3;
  }

  ngOnInit(): void {
    this.searchText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.userService.requestSystemUsersList(this.searchParams))
    ).subscribe(res => {
      this.usersList = res;
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
  }

  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.userService.continueSystemUsersList(this.linkUrl).subscribe(res => {
        this.usersList = this.usersList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  // 点击新建、编辑弹出
  // public onShowModal() {
  //   this.createSystemUser.open();
  // }

  // 查询按钮
  public onSearchBtnClick() {
    this.searchParams.username = this.searchParams.username.trim();
    this.searchText$.next();
    // tslint:disable-next-line:no-unused-expression
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 点击新建、编辑弹出
  public onShowModal(data: SystemUserEntity = new SystemUserEntity()) {
    this.createSystemUser.open(data, () => {
      this.createSystemUser.clear();
      timer(0).subscribe(() => {
        this.searchText$.next();
      });
    });
  }

  // 删除用户
  public onDeleteUser() {
    this.promptService.showConfirmBox('是否确定删除用户xx？', '删除用户', () => {
      console.log('888');
    });
  }

  // 停用用户
  public onStopUser(data) {
    const param = {discontinue_use: true};
    // this.promptService.showConfirmBox('请确认是否停用用户XX？', '停用用户', () => {
    //   console.log('888');
    // }, '停用');
    const message = data.stopStatus ? '停用' : '启用';
    this.promptService.showConfirmBox(`请确认是否停用用户${data.company_name}?`, '提示', () => {
      this.userService.requestUseInsurance(data.ic_id, data).subscribe((e) => {
        this.searchText$.next();
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    });
  }

  // 重置秘钥
  public onResetSecretKey(data) {
    this.promptService.showConfirmBox(`请确认是否要重置${data.company_name}的密钥？`, '重置秘钥', () => {
      console.log('888');
    }, '重置秘钥');
  }

}
