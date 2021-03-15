import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-rectangle-button',
  templateUrl: './rectangle-button.component.html',
  styleUrls: ['./rectangle-button.component.less']
})
export class RectangleButtonComponent implements OnInit {

  @Input() contentData = new RectangleData();

  // private _contentData: Array<any>;
  // @Input()
  // public set contentData(contentData: any) {
  //   this._contentData = contentData;
  //   // if (contentData) {
  //   //   console.log('666');
  //   // }
  // }

  // public get seriesList(): Array<any> {
  //   return this._contentData;
  // }

  constructor() {
  }

  ngOnInit(): void {
  }

}

export class RectangleData {
  constructor(public imageUrl?: string,
              public title?: string) {
  }
}
