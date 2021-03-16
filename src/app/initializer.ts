import {environment} from '../environments/environment';

export const initializer: any = {

  user: null,

  startTimeStamp: null, // 首次的服务器时间戳

  boot: () => {
    return () => {
      return new Promise((callback) => {
        const header = {
          xhrFields: {
            withCredentials: true
          }
        };

        $.ajax(`${environment.PARKING_DOMAIN}/user`, header).done((userData, status, xhr) => {
          initializer.user = userData;
          initializer.startTimeStamp = new Date(xhr.getResponseHeader('date')).getTime() / 1000;
          callback(null);
        }).fail(err => {
          if (err.status === 403) {
            callback(null);
          } else {
            console.log('暂不考虑其他错误！');
          }
        });
      });
    };
  }
};
