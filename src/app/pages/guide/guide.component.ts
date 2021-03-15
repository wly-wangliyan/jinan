import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBoxComponent} from '../../share/components/form-box/form-box.component';
import {GlobalService} from '../../core/global.service';
import {ElementService} from '../../core/element.service';
import {RectangleData} from "./rectangle-button/rectangle-button.component";
import {timer} from "rxjs";

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.less']
})
export class GuideComponent implements OnInit, AfterViewInit {

  @ViewChild('buttonGroup') public buttonGroup: ElementRef;
  @ViewChild(FormBoxComponent) public formBox: FormBoxComponent;

  public operationStatus = false; // 是否显示修改密码块
  public userName = 'admin01';
  public rectangleList = []; // 系统数组
  public permission_ids = [1, 3, 5, 9, 10, 11];
  public src = '/assets/images/guide/001.png';
  public circleDisableStatus = true; // 大屏查看权限
  public userStatus = true; // 用户管理权限

  constructor(private globalService: GlobalService, private elementService: ElementService) {
    this.rectangleList = [
      {position: {top: '135px', left: '124px'}, data: new RectangleData('/assets/images/guide/001_disable.png', '路内泊车监管服务系统'), unDisable: false},
      {position: {top: '247px', left: '72px'}, data: new RectangleData('/assets/images/guide/002_disable.png', '路外停车监管服务系统'), unDisable: false},
      {position: {top: '359px', left: '47px'}, data: new RectangleData('/assets/images/guide/003_disable.png', '新能源监管服务系统'), unDisable: false},
      {position: {top: '471px', left: '47px'}, data: new RectangleData('/assets/images/guide/004_disable.png', '共享单车监管服务系统'), unDisable: false},
      {position: {top: '583px', left: '72px'}, data: new RectangleData('/assets/images/guide/005_disable.png', '热点巡查管理服务系统'), unDisable: false},
      {position: {top: '695px', left: '124px'}, data: new RectangleData('/assets/images/guide/006_disable.png', '治安联控监管服务系统'), unDisable: false},
      {position: {top: '292px', left: '1023px'}, data: new RectangleData('/assets/images/guide/007_disable.png', '征信管理服务系统'), unDisable: false},
      {position: {top: '414px', left: '1037px'}, data: new RectangleData('/assets/images/guide/008_disable.png', '就诊停车预约管理系统'), unDisable: false},
      {position: {top: '536px', left: '1023px'}, data: new RectangleData('/assets/images/guide/009_disable.png', '资源普查管理系统'), unDisable: false},
    ];
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    timer(0).subscribe(() => {
      this.permission_ids.forEach(item => {
        if (item < 10){
          this.rectangleList[item - 1].data.imageUrl = `/assets/images/guide/00${item}.png`;
          this.rectangleList[item - 1].unDisable = true;
        } else if (item === 10){
          this.circleDisableStatus = false;
        } else if (item === 11){
          this.userStatus = false;
        }
      });
    });
    // this.rectangleList = [
    //   {position: {top: '135px', left: '124px'}, data: new RectangleData('/assets/images/guide/001_disable.png', '路内泊车监管服务系统')},
    //   {position: {top: '247px', left: '72px'}, data: new RectangleData('/assets/images/guide/002.png', '路外停车监管服务系统')},
    //   {position: {top: '359px', left: '47px'}, data: new RectangleData('/assets/images/guide/003.png', '新能源监管服务系统')},
    //   {position: {top: '471px', left: '47px'}, data: new RectangleData('/assets/images/guide/004.png', '共享单车监管服务系统')},
    //   {position: {top: '583px', left: '72px'}, data: new RectangleData('/assets/images/guide/005.png', '热点巡查管理服务系统')},
    //   {position: {top: '695px', left: '124px'}, data: new RectangleData('/assets/images/guide/006.png', '治安联控监管服务系统')},
    //   {position: {top: '292px', left: '1023px'}, data: new RectangleData('/assets/images/guide/007.png', '征信管理服务系统')},
    //   {position: {top: '414px', left: '1037px'}, data: new RectangleData('/assets/images/guide/008.png', '就诊停车预约管理系统')},
    //   {position: {top: '536px', left: '1023px'}, data: new RectangleData('/assets/images/guide/009.png', '资源普查管理系统')},
    // ];
    // this.rectangleList[1].data.imageUrl = `/assets/images/guide/007.png`;
    // this.initData();
    // this.rectangleList.forEach(item => {
    //   const index = this.rectangleList.indexOf(item) + 1;
    //   if (this.permission_ids.indexOf(index) > -1) {
    //     console.log(index);
    //   }
    // });
    // this.permission_ids.forEach(item => {
    //
    //   console.log(this.rectangleList[item - 1].data.imageUrl);
    //   this.rectangleList[item].data.imageUrl = `/assets/images/guide/007.png`;
    //   console.log(this.rectangleList);
    // });
  }

  // 点击显示/隐藏修改密码容器
  public onClickChangeStatus(): void {
    this.operationStatus = !this.operationStatus;
  }

  private initData(): void {
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
    });
  }
}
