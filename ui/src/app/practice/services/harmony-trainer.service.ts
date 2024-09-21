import { Injectable } from '@angular/core';
import { interval, Observable, Subject, Subscription } from 'rxjs';
import { MetroParams } from '../../common/components/metronome/metronome.component';
import {
  MetronomeService,
  metronomeStatus,
} from '../../common/services/metronome.service';

export type metroStatus = 'PLAY' | 'STOP';

@Injectable({
  providedIn: 'root',
})
export class HarmonyTrainerService {
  private harmonyTrainerPlayer = new Subject<metronomeStatus>();
  public harmonyTrainerPlayer$ = this.harmonyTrainerPlayer.asObservable();

  public harmonyTrainer?: Observable<number>;
  public harmonyTrainer$?: Subscription;

  private metroSubscription?: Subscription;

  constructor(private metronomeService: MetronomeService) {}

  public setInterval(bpm: number, measuresQuantity: number) {
    const intervalValue = (60000 / bpm) * measuresQuantity;
    this.harmonyTrainer = interval(intervalValue);
    this.harmonyTrainer$ = this.harmonyTrainer.subscribe(() => {
      this.harmonyTrainerPlayer.next('PLAY');
    });
  }

  public getHarmonyTrainer(): Observable<number> | undefined {
    return this.harmonyTrainer;
  }
}
