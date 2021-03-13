import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/auth.service';
import {Router} from '@angular/router';
import {LoginHttpService, LoginParams} from './login-http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  public loginParams = new LoginParams(); // 登录参数
  public isWrongInput = false;
  public wrongMessage = '*用户名或密码错误，请重新输入！';
  public userName = '';
  public password = '';

  constructor(private authService: AuthService,
              private router: Router,
              private loginHttpService: LoginHttpService) {
  }

  ngOnInit(): void {
  }

  public onLoginBtnClick() {
    this.isWrongInput = false;
    if (!this.userName || !this.userName.trim()) {
      this.isWrongInput = true;
      this.wrongMessage = '*用户名或密码错误，请重新输入！';
      return;
    }
    if (!this.password || !this.password.trim()) {
      this.isWrongInput = true;
      this.wrongMessage = '*用户名或密码错误，请重新输入！';
      return;
    }
    this.authService.requestLogin(this.userName, this.password).subscribe(() => {
      this.isWrongInput = false;
      this.router.navigate(['/guide']);
    }, () => {
      this.wrongMessage = '*用户名或密码错误，请重新输入！';
      this.isWrongInput = true;
    });

    // this.loginHttpService.requestLogin(this.loginParams).subscribe(() => {
    //   this.authService.authorizeByLogin();
    // }, err => {
    //   this.isWrongInput = true;
    //   this.wrongMessage = '*用户名或密码错误，请重新输入！';
    // });
  }
}
