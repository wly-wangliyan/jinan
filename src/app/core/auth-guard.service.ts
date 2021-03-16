import {AuthService} from './auth.service';
import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot
} from '@angular/router';

/* 权限守卫 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanLoad, CanActivateChild {


  constructor(private router: Router, private authService: AuthService) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkLogin(state.url);
  }

  public canLoad(route: Route): boolean {
    return this.checkLogin(`/${route.path}`) && this.checkPermission(route.path);
  }

  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkLogin(state.url);
  }

  private checkLogin(url: string): boolean {
    // 根据当前的登录状态来控制页面跳转
    if (url === '/login') {
      if (this.authService.isLoggedIn) {
        this.router.navigate(['/guide']);
        return false;
      }
    } else {
      if (!this.authService.isLoggedIn) {
        this.router.navigate(['/login']);
        return false;
      }
    }
    return true;
  }

  private checkPermission(url: string): boolean {
    const permissionGroup = {
      'inside': 1,
      'screen': 10,
      'user': 11
    };
    if (permissionGroup.hasOwnProperty(url) && this.authService.permission_ids.indexOf(permissionGroup[url]) === -1) {
      this.router.navigate(['/guide']);
      return false;
    }
    return true;
  }
}
