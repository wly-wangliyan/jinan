import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-expanded-menu',
  templateUrl: './expanded-menu.component.html',
  styleUrls: ['./expanded-menu.component.less']
})
export class ExpandedMenuComponent implements OnInit {
  openMap: { [name: string]: boolean } = {
    sub1: true,
    sub2: false,
    sub3: false
  };

  constructor() {
  }

  ngOnInit(): void {
  }

  openHandler(value: string): void {
    for (const key in this.openMap) {
      if (key !== value) {
        this.openMap[key] = false;
      }
    }
  }

}
