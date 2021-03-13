import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {RectangleData} from './rectangle-button/rectangle-button.component';
import {FormBoxComponent} from '../../share/components/form-box/form-box.component';
import {GlobalService} from '../../core/global.service';
import {ElementService} from '../../core/element.service';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.less']
})
export class GuideComponent implements OnInit {

  @ViewChild('buttonGroup') public buttonGroup: ElementRef;
  @ViewChild(FormBoxComponent) public formBox: FormBoxComponent;

  public operationStatus = false;
  public userName = 'admin01';
  public buttonList = [];
  public rectangleList = [];

  constructor(private globalService: GlobalService, private elementService: ElementService) {
  }

  ngOnInit(): void {
    this.initData();
  }

  // 点击显示/隐藏修改密码容器
  public onClickChangeStatus(): void {
    this.operationStatus = !this.operationStatus;
  }

  private initData(): void {
    this.rectangleList = [
      {position: {top: '135px', left: '124px'}, data: new RectangleData('/assets/images/guide/001.png', '路内泊车监管服务系统')},
      {position: {top: '247px', left: '72px'}, data: new RectangleData('/assets/images/guide/002.png', '路外停车监管服务系统')},
      {position: {top: '359px', left: '47px'}, data: new RectangleData('/assets/images/guide/003.png', '新能源监管服务系统')},
      {position: {top: '471px', left: '47px'}, data: new RectangleData('/assets/images/guide/004.png', '共享单车监管服务系统')},
      {position: {top: '583px', left: '72px'}, data: new RectangleData('/assets/images/guide/005.png', '热点巡查管理服务系统')},
      {position: {top: '695px', left: '124px'}, data: new RectangleData('/assets/images/guide/006.png', '治安联控监管服务系统')},
      {position: {top: '292px', left: '1023px'}, data: new RectangleData('/assets/images/guide/007.png', '征信管理服务系统')},
      {position: {top: '414px', left: '1037px'}, data: new RectangleData('/assets/images/guide/008.png', '就诊停车预约管理系统')},
      {position: {top: '536px', left: '1023px'}, data: new RectangleData('/assets/images/guide/009.png', '资源普查管理系统')},
    ];
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
    });
  }
}
