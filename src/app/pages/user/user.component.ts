import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {FormBoxComponent} from '../../share/components/form-box/form-box.component';
import {GlobalService} from '../../core/global.service';
import {ElementService} from '../../core/element.service';
import {AuthService} from "../../core/auth.service";
import {Subject} from "rxjs/index";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {

  @ViewChild('buttonGroup') public buttonGroup: ElementRef;
  @ViewChild(FormBoxComponent) public formBox: FormBoxComponent;
  @ViewChild('routerDiv') public routerDiv: ElementRef;
  public operationStatus = false;
  public userName = 'admin01';


  constructor(private globalService: GlobalService,
              private elementService: ElementService,
              private renderer2: Renderer2,
              public authService: AuthService) {
  }

  ngOnInit(): void {

  }

  // 点击显示/隐藏修改密码容器
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
