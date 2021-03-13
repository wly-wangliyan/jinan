import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-carousel-map',
  templateUrl: './carousel-map.component.html',
  styleUrls: ['./carousel-map.component.less']
})
export class CarouselMapComponent implements OnInit {

  public array = ['assets/images/hotspot/hotspot001.jpeg', '/assets/images/hotspot/hotspot002.jpeg',
    '/assets/images/hotspot/hotspot003.jpg', '/assets/images/hotspot/hotspot004.jpg', 'assets/images/hotspot/hotspot005.jpeg'];
  public effect = 'scrollx';

  constructor() {
  }

  ngOnInit(): void {
  }

}
