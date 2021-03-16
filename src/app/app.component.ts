import {Component} from '@angular/core';
import {AuthService} from './core/auth.service';
import {HttpService} from './core/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  constructor(private authService: AuthService, private httpService: HttpService) {
    // authService.authorizeBySecretKey(initializer.user);
    // httpService.setStartTimeStamp(initializer.startTimeStamp);
  }
}
