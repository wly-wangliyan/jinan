import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-inspection-linkage',
  templateUrl: './inspection-linkage.component.html',
  styleUrls: ['./inspection-linkage.component.less']
})
export class InspectionLinkageComponent implements OnInit {

  public linkageArray = ['952', '847', '976', '175'];

  constructor() {
  }

  ngOnInit(): void {
  }

}
