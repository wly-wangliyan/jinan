import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {FormBoxComponent} from '../../share/components/form-box/form-box.component';
import {GlobalService} from '../../core/global.service';
import {ElementService} from '../../core/element.service';
import {AuthService} from '../../core/auth.service';
import {RouteMonitorService} from '../../core/route-monitor.service';
import {Http500PageComponent} from '../../share/components/http-500-page/http-500-page.component';
import {Http403PageComponent} from 'src/app/share/components/http-403-page/http-403-page.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit, AfterViewInit {

  @ViewChild('buttonGroup') public buttonGroup: ElementRef;
  @ViewChild(FormBoxComponent) public formBox: FormBoxComponent;
  @ViewChild('routerDiv') public routerDiv: ElementRef;
  @ViewChild(Http403PageComponent, {static: true}) public global403Page: Http403PageComponent;
  @ViewChild(Http500PageComponent, {static: true}) public global500Page: Http500PageComponent;
  public operationStatus = false; // 是否显示修改密码容器
  public userName = 'admin01';


  constructor(private globalService: GlobalService,
              private elementService: ElementService,
              private renderer2: Renderer2,
              public authService: AuthService,
              private routeService: RouteMonitorService) {
  }

  ngOnInit(): void {

  }

  public ngAfterViewInit() {
    this.globalService.http403Tip = this.global403Page;
    this.globalService.http500Tip = this.global500Page;
    this.routeService.routePathChanged.subscribe(() => {
      // 到路由变更时重置显示状态
      this.global403Page.http403Flag = false;
      this.global500Page.http500Flag = false;
    });
  }

  // 点击显示或隐藏修改密码容器
  public onClickChangeStatus(): void {
    this.operationStatus = !this.operationStatus;
  }

  // 修改密码
  public onChangePwd() {
    this.globalService.formBox.open('修改密码', '修改', () => {
      this.globalService.changePwd(this.globalService.formBox.originalPwd, this.globalService.formBox.confirmNewPwd);
      // sessionStorage.clear();
    }, '确定', () => {
      this.globalService.formBox.originalPwd = '';
      this.globalService.formBox.newPwd = '';
      this.globalService.formBox.confirmNewPwd = '';
    });
  }

  // 退出登录
  public logout() {
    this.elementService.showConfirmBox('是否退出系统？', '提示', () => {
      this.authService.logout();
    });
  }

  // 修改403或500状态
  public displayStateChanged(): void {
    if (this.globalService.http403Tip.http403Flag || this.globalService.http500Tip.http500Flag) {
      this.renderer2.setStyle(this.routerDiv.nativeElement, 'display', 'none');
    } else {
      this.renderer2.setStyle(this.routerDiv.nativeElement, 'display', 'block');
    }
  }
}
