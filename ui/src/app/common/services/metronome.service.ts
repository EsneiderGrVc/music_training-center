import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable, Subject } from 'rxjs';
import { MetroParams } from '../components/metronome/metronome.component';

export type metronomeStatus = 'PLAY' | 'STOP';

@Injectable({
  providedIn: 'root',
})
export class MetronomeService {
  public metronomePlayer = new Subject<number>();
  public metronomeStoped = new Subject<void>();

  constructor() {}
}
