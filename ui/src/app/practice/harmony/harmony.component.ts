import { Component, NgZone, OnInit, signal } from "@angular/core";
import { interval, Observable, Subscription } from "rxjs";
import { MetronomeService } from "../../common/services/metronome.service";
import { HarmonyTrainerService } from "../services/harmony-trainer.service";

@Component({
  selector: "app-harmony",
  templateUrl: "./harmony.component.html",
  styleUrl: "./harmony.component.css",
})
export class HarmonyComponent implements OnInit {
  public numerator = 4;
  // public denominator = 4;
  public changeTonalityOn = 4;
  public measureInterval$: any;

  public metronomeGraphic: number[] = [];

  public displayedTonality = signal("");
  public pickedTonalities: string[] = [];
  public countInBefore = 4;
  public countBuffer = 0;
  public availableTonalities = [
    "Gb",
    "Db",
    "Ab",
    "Eb",
    "Bb",
    "F",
    "Do",
    "Sol",
    "Re",
    "A",
    "E",
    "B",
  ];
  public majorTonalities = [
    "Gb",
    "Db",
    "Ab",
    "Eb",
    "Bb",
    "F",
    "Do",
    "Sol",
    "Re",
    "A",
    "E",
    "B",
  ];
  public selectedTonalities: string[] = [];
  public playingTonalities: string[] = [];

  public nextTonality = signal("");
  public measureGraphic: number[] = [];

  private metroSubscription?: Subscription;
  public isInitial = true;

  constructor(
    private harmonyTrainerService: HarmonyTrainerService,
    private metroService: MetronomeService
  ) {}

  ngOnInit(): void {
    this.measureGraphic = Array.from(
      { length: this.changeTonalityOn },
      (_, index) => index + 1
    );
  }
  private setHarmonyTrainer() {
    this.displayedTonality.set("");
    this.nextTonality.set("");
    this.countBuffer = this.countInBefore * -1;
    this.playingTonalities = [...this.selectedTonalities];
    this.tonalityPicker();
    this.tonalityPicker();
    this.metroSubscription = this.metroService.metronomePlayer.subscribe(
      (currentBeat) => {
        const ledIdx =
          (this.countBuffer / this.numerator) % this.changeTonalityOn;
        if (ledIdx === 0) {
          const measureLeds = document.querySelectorAll(".measure-led");
          measureLeds.forEach(
            (e) => ((e as HTMLElement).style.backgroundColor = "unset")
          );
        }
        if (Number.isInteger(ledIdx)) {
          const led = document.getElementById(`measure-led-${ledIdx}`);
          if (led) led.style.backgroundColor = "gray";
        }
        if (this.countBuffer % (this.numerator * this.changeTonalityOn) === 0) {
          this.swapNextToDisplayed();
        }
        this.countBuffer++;
      }
    );
    this.metroService.metronomeStoped.subscribe(() => {
      this.countBuffer = this.countInBefore * -1;
    });
  }

  private swapNextToDisplayed() {
    if (this.nextTonality()) {
      this.displayedTonality.set(this.nextTonality());
      this.tonalityPicker();
    }
  }

  public tonalityPicker = () => {
    const randomTonalityIndex = Math.floor(
      Math.random() * this.playingTonalities.length
    );
    const removedTonality = this.playingTonalities
      .splice(randomTonalityIndex, 1)
      .at(0);
    if (removedTonality) {
      this.isInitial
        ? this.displayedTonality.set(removedTonality)
        : this.nextTonality.set(removedTonality);
      this.pickedTonalities.push(removedTonality);
    }
    if (this.playingTonalities.length === 0) {
      const removedItems = this.pickedTonalities.splice(
        0,
        this.pickedTonalities.length
      );
      this.playingTonalities.push(...removedItems);
    }
    this.isInitial = false;
  };

  public stopTrainer = () => {
    // this.hTSubscription?.unsubscribe();
  };

  public toggleTonality(tonality: string) {
    if (this.selectedTonalities.includes(tonality)) {
      this.selectedTonalities = this.selectedTonalities.filter(
        (item) => item !== tonality
      );
      this.pickedTonalities = this.pickedTonalities.filter(
        (item) => item !== tonality
      );
      this.playingTonalities = this.playingTonalities.filter(
        (item) => item !== tonality
      );
    } else {
      this.selectedTonalities.push(tonality);
    }
    if (this.selectedTonalities.length > 2) {
      this.resetHarmonyTrainer();
      this.setHarmonyTrainer();
    } else {
      this.nextTonality.set("");
      this.displayedTonality.set("");
    }
  }

  public resetHarmonyTrainer() {
    this.metroSubscription?.unsubscribe();
    this.playingTonalities = [];
    this.pickedTonalities = [];
  }

  public isSelected(tonality: string): boolean {
    return this.selectedTonalities.includes(tonality);
  }
}
