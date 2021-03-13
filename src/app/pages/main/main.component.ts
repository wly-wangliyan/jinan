import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {FormBoxComponent} from '../../share/components/form-box/form-box.component';
import {GlobalService} from '../../core/global.service';
import {ElementService} from '../../core/element.service';
import {createCustomElement} from '@angular/elements';
import {PromptBoxComponent} from '../../share/components/prompt-box/prompt-box.component';
import {ConfirmationBoxComponent} from '../../share/components/confirmation-box/confirmation-box.component';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit, AfterViewInit {
  @ViewChild(FormBoxComponent) public formBox: FormBoxComponent;

  constructor(private globalService: GlobalService, injector: Injector, public elementService: ElementService) {

    const PromptElement = createCustomElement(PromptBoxComponent, {injector});
    customElements.define('prompt-element', PromptElement);

    const ConfirmElement = createCustomElement(ConfirmationBoxComponent, {injector});
    customElements.define('confirm-element', ConfirmElement);
  }

  ngOnInit(): void {
  }

  public ngAfterViewInit() {
    this.globalService.formBox = this.formBox;
  }

}
