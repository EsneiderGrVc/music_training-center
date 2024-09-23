import { Injectable } from "@angular/core";
import { interval, Observable, Subject, Subscription } from "rxjs";
import {
  MetronomeService,
  metronomeStatus,
} from "../../common/services/metronome.service";
import {
  HarmonyParams,
  HarmonyParams_Set,
} from "../../common/models/harmony-params.interface";

export type metroStatus = "PLAY" | "STOP";

@Injectable({
  providedIn: "root",
})
export class HarmonyTrainerService {
  private harmonyTrainerPlayer = new Subject<metronomeStatus>();
  public harmonyTrainerPlayer$ = this.harmonyTrainerPlayer.asObservable();
  private defaultHarmonyProps: HarmonyParams = {
    bars: 4,
  };

  public harmonyTrainer?: Observable<number>;
  public harmonyTrainer$?: Subscription;

  private metroSubscription?: Subscription;

  constructor(private metronomeService: MetronomeService) {}

  public setInterval(bpm: number, measuresQuantity: number) {
    const intervalValue = (60000 / bpm) * measuresQuantity;
    this.harmonyTrainer = interval(intervalValue);
    this.harmonyTrainer$ = this.harmonyTrainer.subscribe(() => {
      this.harmonyTrainerPlayer.next("PLAY");
    });
  }

  public getHarmonyTrainer(): Observable<number> | undefined {
    return this.harmonyTrainer;
  }

  public getHarmonyProps() {
    return JSON.parse(
      localStorage.getItem("harmonyProps") ||
        JSON.stringify(this.defaultHarmonyProps)
    );
  }
  public setHarmonyProps(property: HarmonyParams_Set, value: number): void {
    const harmonyProps: { [key: string]: number } =
      this.getHarmonyProps() as any;
    harmonyProps[property] = value;
    if (!(property in harmonyProps)) {
      console.error(
        `${property} is not a know property of Metronome Properties`
      );
      return;
    }
    localStorage.setItem("harmonyProps", JSON.stringify(harmonyProps));
  }
}
