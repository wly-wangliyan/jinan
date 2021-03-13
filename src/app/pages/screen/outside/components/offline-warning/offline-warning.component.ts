import { Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { DynamicInfoEntity, InsideHttpService, ParkingDynamicParams } from 'src/app/pages/screen/inside/inside-http.service';
import districts from '../../../home/map-districts';

@Component({
  selector: 'app-offline-warning',
  templateUrl: './offline-warning.component.html',
  styleUrls: ['./offline-warning.component.less']
})
export class OfflineWarningComponent implements OnInit {

  public districts = districts;

  public searchParams: ParkingDynamicParams = new ParkingDynamicParams();

  public dataList: Array<DynamicInfoEntity> = [];

  @Output() private toggle = new EventEmitter();

  @ViewChild('offlineWarnModal') private offlineWarnModal: ElementRef;

  constructor(private insideHttpService: InsideHttpService, private renderer2: Renderer2) {
    this.searchParams.parking_type = 2;
    this.searchParams.online_status = 2;
    this.searchParams.page_size = 100;
  }

  ngOnInit(): void {
    this.requestData();
  }

  public onClose(): void {
    this.toggle.emit();
  }

  public onClearClick(): void {
    this.searchParams.code = '';
    this.requestData();
  }

  public refresh(): void {
    this.requestData();
  }

  public requestData(): void {
    this.insideHttpService.requestAllDynamicInfo(this.searchParams).subscribe(results => {
      this.dataList = results;
    })
  }


}
