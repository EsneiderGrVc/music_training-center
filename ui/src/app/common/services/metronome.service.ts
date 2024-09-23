import { Injectable } from "@angular/core";
import { BehaviorSubject, interval, Observable, Subject } from "rxjs";
import { MetroParams, MetroParams_Set } from "../models/metro-params.interface";

export type metronomeStatus = "PLAY" | "STOP";

@Injectable({
  providedIn: "root",
})
export class MetronomeService {
  public metronomePlayer = new Subject<number>();
  public metronomeStoped = new Subject<void>();

  private defaultMetroProps: MetroParams = {
    bpm: 90,
    numerator: 4,
    denominator: 4,
    minute: 60000,
  };

  constructor() {}

  public getMetroProps(): MetroParams {
    return JSON.parse(
      localStorage.getItem("metroProps") ||
        JSON.stringify(this.defaultMetroProps)
    );
  }
  public setMetroProps(property: MetroParams_Set, value: number): void {
    const metroProps: { [key: string]: number } = this.getMetroProps() as any;
    metroProps[property] = value;
    if (!(property in metroProps)) {
      console.error(
        `${property} is not a know property of Metronome Properties`
      );
      return;
    }
    localStorage.setItem("metroProps", JSON.stringify(metroProps));
  }
}
