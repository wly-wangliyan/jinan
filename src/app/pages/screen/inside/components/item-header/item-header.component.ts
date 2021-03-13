import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-item-header',
  templateUrl: './item-header.component.html',
  styleUrls: ['./item-header.component.less']
})
export class ItemHeaderComponent implements OnInit {

  @Input() public nameList: Array<string> = [];

  @Output() public nameClick = new EventEmitter();

  public selectedIndex = 0; // 当前选中项

  constructor() {
  }

  ngOnInit(): void {
  }

  public onNameClick(index: number): void {
    if (this.selectedIndex === index) {
      return;
    }
    this.selectedIndex = index;
    this.nameClick.emit(index);
  }

}
