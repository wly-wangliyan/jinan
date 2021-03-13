import { Component, OnInit } from '@angular/core';
import { mockData } from '../../mock-data';

@Component({
  selector: 'app-right-three',
  templateUrl: './right-three.component.html',
  styleUrls: ['./right-three.component.less']
})
export class RightThreeComponent implements OnInit {

  public onlineEarlyWarning = mockData.earlyWarning.online;

  public carEarlyWarning = mockData.earlyWarning.car;

  constructor() {
  }

  ngOnInit(): void {
  }

}
