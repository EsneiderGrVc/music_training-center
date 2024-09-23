import { CommonModule, isPlatformBrowser } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Howl } from "howler";
import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  PLATFORM_ID,
  signal,
} from "@angular/core";
import { interval, Observable, startWith, Subscription } from "rxjs";
import { MetronomeService } from "../../services/metronome.service";
import { MetroParams } from "../../models/metro-params.interface";

export type Accent = "green" | "yellow" | "red";

export interface Beat {
  accent: Accent;
  idx: number;
}

@Component({
  selector: "app-metronome",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./metronome.component.html",
  styleUrl: "./metronome.component.css",
})
export class MetronomeComponent implements OnInit {
  @Output() metronomeStarted = new EventEmitter<MetroParams>();
  @Output() metronomeStoped = new EventEmitter();

  public metroProps: MetroParams;
  private sound?: Howl;
  public audio?: HTMLAudioElement;
  public numerator = 4;
  public denominator = 4;
  private minute = 60000;
  public playing = false;
  public metroSubscription$?: Subscription;
  public currentBeat = signal(1);
  public metronomeGraphic: Beat[] = [];

  constructor(private metroService: MetronomeService) {
    this.metroProps = this.metroService.getMetroProps();
  }

  ngOnInit(): void {
    this.metronomeGraphic = Array.from(
      { length: this.numerator },
      (_, index) => {
        if (index === 0) {
          return { accent: "red", idx: index + 1 };
        } else {
          return { accent: "green", idx: index + 1 };
        }
      }
    );
  }

  private loadMetroSound() {
    this.sound = new Howl({
      src: ["assets/metro.wav"],
      volume: 1.0,
    });
  }
  public metroPlayer(): void {
    this.playing ? this.stopMetro() : this.startMetro();
  }
  public startMetro() {
    this.loadMetroSound();
    this.playing = true;

    // this.currentBeat.set(-1);
    this.metroSubscription$ = interval(60000 / this.metroProps.bpm)
      // .pipe(startWith(1))
      .subscribe(() => {
        this.metroService.metronomePlayer.next(this.currentBeat());
        this.playMetro();
      });
  }

  public playMetro = () => {
    this.sound?.play();
    // setTimeout(() => {
    const led = document.getElementById(`led-${this.currentBeat()}`);
    if (led) {
      led.style.backgroundColor =
        this.metronomeGraphic.find((beat) => beat.idx === this.currentBeat())
          ?.accent || "green";
    }
    setTimeout(() => {
      if (led) {
        led.style.backgroundColor = "unset";
      }
    }, 150);
    this.currentBeat.update((value) => this.computeCurrentBeat(value));
    // }, 200);
  };

  public stopMetro = () => {
    this.playing = false;
    this.metroSubscription$?.unsubscribe();
    this.metroService.metronomeStoped.next();
    this.currentBeat.update((value) => 1);
  };

  private computeCurrentBeat(value: number): number {
    return value < this.numerator ? value + 1 : 1;
  }

  public onBpmChange(event: Event) {
    this.stopMetro();
    const value = (event.target as HTMLInputElement).value;
    this.metroService.setMetroProps("bpm", Number(value));
  }

  public increaseBpm() {
    this.stopMetro();
    const value = this.metroProps.bpm + 1;
    this.metroProps.bpm++;
    this.metroService.setMetroProps("bpm", value);
  }
  public decreaseBpm() {
    this.stopMetro();
    const value = this.metroProps.bpm - 1;
    this.metroProps.bpm--;
    this.metroService.setMetroProps("bpm", value);
  }
}
