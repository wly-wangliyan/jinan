import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-rectangle-button',
  templateUrl: './rectangle-button.component.html',
  styleUrls: ['./rectangle-button.component.less']
})
export class RectangleButtonComponent implements OnInit {

  @Input() contentData = new RectangleData();

  constructor() { }

  ngOnInit(): void {
  }

}

export class RectangleData {
  constructor(public imageUrl?: string,
              public title?: string){}
}
