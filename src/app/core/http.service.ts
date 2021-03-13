import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/internal/operators';
import {EntityBase} from "../../utils/z-entity";

@Injectable({
  providedIn: 'root'
})
export class HttpService {



  private static timeStampValue = new Date().getTime() / 1000;
  private _timeStamp = new Date().getTime() / 1000;

  constructor(private http: HttpClient) {
    interval(1000).subscribe(() => {
      HttpService.timeStampValue += 1;
    });
  }

  /**
   * 获取当前服务器时间戳(秒）
   * @returns number
   */
  public get timeStamp(): number {
    return HttpService.timeStamp;
  }

  /**
   * 获取当前的服务器时间戳(秒)
   */
  public static get timeStamp(): number {
    return this.timeStampValue;
  }

  /**
   * 设置首次的服务器时间戳(只能调用一次)
   */
  public setStartTimeStamp(timeStamp: number) {
    if (!(timeStamp === null || timeStamp === undefined)) {
      HttpService.timeStampValue = timeStamp;
    }
  }

  private generateDefaultOptions(): any {
    const requestOptions: any = {};
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/JSON');
    headers = headers.set('Content-Type', 'application/JSON;charset=UTF-8');
    requestOptions.headers = headers;
    requestOptions.withCredentials = true;
    requestOptions.observe = 'response';
    return requestOptions;
  }

  private generateFormOptions(): any {
    const requestOptions: any = {};
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/JSON');
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    requestOptions.headers = headers;
    requestOptions.withCredentials = true;
    requestOptions.observe = 'response';
    return requestOptions;
  }

  private updateOptions(options: any, params?: any, headers?: any) {
    if (params) {
      options.params = new HttpParams({fromObject: params});
    }
    if (headers) {
      for (const key in headers) {
        if (!headers.hasOwnProperty(key)) {
          continue;
        }
        options.headers = options.headers.set(key, headers[key]);
      }
    }
  }

  private tapDate(): any {
    return map((response: HttpResponse<any>) => {
      HttpService.timeStampValue = response.headers.get('date') ?
        new Date(response.headers.get('date')).getTime() / 1000 : HttpService.timeStampValue;
      return response;
    });
  }

  public get(url: string, params?: any, headers?: any): Observable<HttpResponse<any>> {
    const options = this.generateFormOptions();
    this.updateOptions(options, params, headers);
    return this.http.get(url, options).pipe(this.tapDate());
  }

  public post(url: string, body?: any, headers?: any, params?: any): Observable<HttpResponse<any>> {
    const options = this.generateDefaultOptions();
    this.updateOptions(options, params, headers);
    return this.http.post(url, body, options).pipe(this.tapDate());
  }

  public postFormData(url: string, body?: any, headers?: any, params?: any): Observable<HttpResponse<any>> {
    const options = this.generateFormOptions();
    let tempBody = '';
    Object.getOwnPropertyNames(body).forEach(property => {
      if (body[property]) {
        tempBody += `${property}=` + encodeURIComponent(body[property]) + '&';
      }
    });
    tempBody = tempBody.length > 0 ? tempBody.slice(0, tempBody.length - 1) : tempBody;
    this.updateOptions(options, params, headers);
    return this.http.post(url, tempBody, options).pipe(this.tapDate());
  }

  public put(url: string, body?: any, headers?: any, params?: any): Observable<HttpResponse<any>> {
    const options = this.generateDefaultOptions();
    this.updateOptions(options, params, headers);
    return this.http.put(url, body, options).pipe(this.tapDate());
  }

  public patch(url: string, body?: any, headers?: any, params?: any): Observable<HttpResponse<any>> {
    const options = this.generateDefaultOptions();
    this.updateOptions(options, params, headers);
    return this.http.patch(url, body, options).pipe(this.tapDate());
  }

  public delete(url: string, headers?: any): Observable<HttpResponse<any>> {
    const options = this.generateDefaultOptions();
    this.updateOptions(options, null, headers);
    return this.http.delete(url, options).pipe(this.tapDate());
  }

  /**
   * 辅助方法，生成请求检索参数,适用于params请求，非body
   * @param objParams 简单的obj对象，非实例
   */
  public generateURLSearchParams(objParams: any): any {
    const searchParams = {};

    if ((objParams === null || objParams === undefined)) {
      return searchParams;
    }

    Object.getOwnPropertyNames(objParams).forEach(property => {
      if (!(objParams[property] === null || objParams[property] === undefined)) {
        searchParams[property] = objParams[property];
      }
    });

    return searchParams;
  }

  /**
   * 辅助方法,就是在上面的方法基础上加上了分页信息两个字段
   * @param objParams 简单的obj对象，非实例
   */
  public generateListURLSearchParams(objParams: any): any {
    const searchParams = this.generateURLSearchParams(objParams);
    searchParams.page_num = 1;
    searchParams.page_size = 45;
    searchParams.page_limit = 45;
    return searchParams;
  }

  public serialize(params: any): string {
    return Object.keys(params).filter(key => !!params[key]).map(key => key + '=' + params[key]).join('&');
  }
}

/*返回结果处理*/
export abstract class LinkResponse {

  public results: Array<any>;
  public linkUrl: string;

  constructor(httpResponse: any) {
    const results = httpResponse.body;
    const linkInfo = httpResponse.headers.get('Link');
    if (linkInfo) {
      this.linkUrl = linkInfo.split('>')[0].split('<')[1];
    }
    this.results = this.generateEntityData(results);
  }

  public abstract generateEntityData(results: Array<any>): Array<any>;
}

export class DefaultLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<any> {
    return results;
  }
}

export interface IHttpError {
  message: string;
  errors: Array<IHttpErrorContent>;
}

export interface IHttpErrorContent {
  field: string;
  code: string|'invalid'|'already_exist';
  resource: string;
}

export class HttpErrorContentEntity extends EntityBase {
  public field: string = undefined;
  public code: string | 'invalid' | 'already_existed' = undefined;
  public resource: string = undefined;
}

export class HttpErrorEntity extends EntityBase {
  public message: string = undefined;
  public errors: Array<HttpErrorContentEntity> = undefined;

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'errors') {
      return HttpErrorContentEntity;
    }
    return null;
  }
}
