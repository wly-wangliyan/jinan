import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bottom-panel',
  templateUrl: './bottom-panel.component.html',
  styleUrls: ['./bottom-panel.component.less']
})
export class BottomPanelComponent implements OnInit {

  @Input() title: string;

  private _count: number;
  @Input() set count(count: number) {
    this._count = count;
    if (count !== null && count !== undefined) {
      this.displayNumber = count.toString();
    }
  }

  get count(): number {
    return this._count;
  }

  public displayNumber = '';

  ngOnInit(): void {
  }
}
