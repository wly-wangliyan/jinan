import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PowerOverviewModalListenerService {

  public powerOverviewModalClick$ = new Subject();

  constructor() { }
}
