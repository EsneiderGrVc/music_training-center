import { Component, NgZone, OnInit, signal } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { MetroParams } from '../../common/components/metronome/metronome.component';
import { MetronomeService } from '../../common/services/metronome.service';
import { HarmonyTrainerService } from '../services/harmony-trainer.service';

@Component({
  selector: 'app-harmony',
  templateUrl: './harmony.component.html',
  styleUrl: './harmony.component.css',
})
export class HarmonyComponent implements OnInit {
  public numerator = 4;
  // public denominator = 4;
  public changeTonalityOn = 4;
  public measureInterval$: any;

  public metronomeGraphic: number[] = [];

  public displayedTonality = signal('');
  public pickedTonalities: string[] = [];
  public countInBefore = 4;
  public countBuffer = 0;
  public availableTonalities = [
    'Gb',
    'Db',
    'Ab',
    'Eb',
    'Bb',
    'F',
    'C',
    'G',
    'D',
    'A',
    'E',
    'B',
  ];
  public majorTonalities = [
    'Gb',
    'Db',
    'Ab',
    'Eb',
    'Bb',
    'F',
    'C',
    'G',
    'D',
    'A',
    'E',
    'B',
  ];
  public selectedTonalities: string[] = [];
  private playingTonalities: string[] = [];

  public nextTonality = signal('');

  private hTSubscription?: Subscription;
  public isInitial = true;

  constructor(
    private harmonyTrainerService: HarmonyTrainerService,
    private metroService: MetronomeService
  ) {}

  ngOnInit(): void {
    // this.tonalityPicker();
    // this.tonalityPicker();
    // this.metroService.metronomePlayer.subscribe((currentBeat) => {
    //   console.log(this.countBuffer);
    //   if (
    //     (this.countInBefore <= this.countBuffer &&
    //       this.countBuffer % (this.numerator * this.changeTonalityOn) === 0 &&
    //       this.countBuffer !== 0) ||
    //     this.countBuffer === this.numerator
    //   ) {
    //     this.swapNextToDisplayed();
    //   }
    //   this.countBuffer++;
    // });
    // this.metroService.metronomeStoped.subscribe(() => {
    //   this.countBuffer = 0;
    // });
  }
  private setHarmonyTrainer() {
    this.playingTonalities = [...this.selectedTonalities];
    this.tonalityPicker();
    this.tonalityPicker();
    this.metroService.metronomePlayer.subscribe((currentBeat) => {
      if (
        (this.countInBefore <= this.countBuffer &&
          this.countBuffer % (this.numerator * this.changeTonalityOn) === 0 &&
          this.countBuffer !== 0) ||
        this.countBuffer === this.numerator
      ) {
        this.swapNextToDisplayed();
      }
      this.countBuffer++;
    });
    this.metroService.metronomeStoped.subscribe(() => {
      this.countBuffer = 0;
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
      // Remove tonality if already selected
      this.selectedTonalities = this.selectedTonalities.filter(
        (item) => item !== tonality
      );
    } else {
      // Add tonality if not selected
      this.selectedTonalities.push(tonality);
      if (this.selectedTonalities.length > 2) {
        console.log(this.availableTonalities);
        this.setHarmonyTrainer();
      }
    }
  }

  public isSelected(tonality: string): boolean {
    return this.selectedTonalities.includes(tonality);
  }
}
