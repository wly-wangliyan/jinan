import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BicycleAreaNumListenerService {

  public areaBicycleNumDivClick$: Subject<any> = new Subject();

  constructor() { }
}
