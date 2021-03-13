import {Component, OnInit, ViewChild} from '@angular/core';
import {CreatePlatformUserComponent} from '../platform-user/create-platform-user/create-platform-user.component';
import {ElementService} from '../../../core/element.service';
import {CreateSystemUserComponent} from "./create-system-user/create-system-user.component";

@Component({
  selector: 'app-system-user',
  templateUrl: './system-user.component.html',
  styleUrls: ['./system-user.component.less']
})
export class SystemUserComponent implements OnInit {

  @ViewChild('createSystemUser', {static: false}) public createSystemUser: CreateSystemUserComponent;


  public noResultText = '数据加载中...';
  public pageSize = 10; // 与列表中pageSize保持一致，用于计算序号
  public pageIndex = 1;
  public platformCouponList = [{
    name: 'hello', coupon_type: 'hello1', reduce_amount: '22', issued_company: 'beauty',
    getServiceName: 'wang'
  }, {
    name: 'hello', coupon_type: 'hello1', reduce_amount: '22', issued_company: 'beauty',
    getServiceName: 'wang'
  }, {
    name: 'hello', coupon_type: 'hello1', reduce_amount: '22', issued_company: 'beauty',
    getServiceName: 'wang'
  }, {
    name: 'hello', coupon_type: 'hello1', reduce_amount: '22', issued_company: 'beauty',
    getServiceName: 'wang'
  }, {
    name: 'hello', coupon_type: 'hello1', reduce_amount: '22', issued_company: 'beauty',
    getServiceName: 'wang'
  }, {
    name: 'hello', coupon_type: 'hello1', reduce_amount: '22', issued_company: 'beauty',
    getServiceName: 'wang'
  }, {
    name: 'hello', coupon_type: 'hello1', reduce_amount: '22', issued_company: 'beauty',
    getServiceName: 'wang'
  }, {
    name: 'hello', coupon_type: 'hello1', reduce_amount: '22', issued_company: 'beauty',
    getServiceName: 'wang'
  }
    , {
      name: 'hello', coupon_type: 'hello1', reduce_amount: '22', issued_company: 'beauty',
      getServiceName: 'wang'
    }, {
      name: 'hello', coupon_type: 'hello1', reduce_amount: '22', issued_company: 'beauty',
      getServiceName: 'wang'
    }, {
      name: 'hello', coupon_type: 'hello1', reduce_amount: '22', issued_company: 'beauty',
      getServiceName: 'wang'
    }, {
      name: 'hello', coupon_type: 'hello1', reduce_amount: '22', issued_company: 'beauty',
      getServiceName: 'wang'
    }
  ];

  constructor(public promptService: ElementService) {
  }

  ngOnInit(): void {
  }

  public onChangeCompanyTypeSearch(e) {
    console.log(e);
  }

  public onNZPageIndexChange(pageIndex: number) {
    console.log('yy');
    // this.pageIndex = pageIndex;
    // if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
    //   // 当存在linkUrl并且快到最后一页了请求数据
    //   this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
    //   this.continueRequestSubscription = this.platformCouponHttpService.continueCouponList(this.linkUrl).subscribe(res => {
    //     this.platformCouponList = [...this.platformCouponList, ...res.results];
    //     this.linkUrl = res.linkUrl;
    //   }, err => {
    //     this.globalService.httpErrorProcess(err);
    //   });
    // }
  }

  // 点击新建、编辑弹出
  public onShowModal() {
    this.createSystemUser.open();
  }

  // 删除用户
  public onDeleteUser() {
    this.promptService.showConfirmBox('是否确定删除用户xx？', '删除用户', () => {
      console.log('888');
    });
  }

  // 删除用户
  public onStopUser() {
    this.promptService.showConfirmBox('请确认是否停用用户XX？', '停用用户', () => {
      console.log('888');
    }, '停用');
  }

  // 重置秘钥
  public onResetSecretKey() {
    this.promptService.showConfirmBox('请确认是否重置用户XX的秘钥？', '重置秘钥', () => {
      console.log('888');
    }, '重置秘钥');
  }

}
