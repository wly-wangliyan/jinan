import {Injectable} from '@angular/core';
import {NgElement, WithProperties} from '@angular/elements';
import {PromptBoxComponent} from '../share/components/prompt-box/prompt-box.component';
import {ConfirmationBoxComponent} from '../share/components/confirmation-box/confirmation-box.component';


@Injectable({
  providedIn: 'root'
})
export class ElementService {

  constructor() {
  }

  // 展示确认弹框
  showPromptBox(message: string, imgStatus: number = 1, closeFunc: any = null) {
    const promptEl: NgElement & WithProperties<PromptBoxComponent> = document.createElement('prompt-element') as any;
    promptEl.addEventListener('closed', () => document.body.removeChild(promptEl));
    promptEl.message = message;
    promptEl.imgStatus = imgStatus;
    promptEl.callback = closeFunc;
    document.body.appendChild(promptEl);
    // timer(3).subscribe(() => {
    //   promptEl.closed.next();
    // });
  }

  // 展示提示弹框
  showConfirmBox(message: string, title: string, surFunc: any, sureButton: string = '确定') {
    const promptEl: NgElement & WithProperties<ConfirmationBoxComponent> = document.createElement('confirm-element') as any;
    promptEl.addEventListener('closed', () => document.body.removeChild(promptEl));
    promptEl.message = message;
    promptEl.title = title;
    promptEl.sureCallback = surFunc;
    promptEl.sureButton = sureButton;
    document.body.appendChild(promptEl);
  }
}
