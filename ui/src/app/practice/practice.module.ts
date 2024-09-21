import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HarmonyComponent } from './harmony/harmony.component';
import { MetronomeComponent } from '../common/components/metronome/metronome.component';

@NgModule({
  declarations: [HarmonyComponent],
  imports: [CommonModule, MetronomeComponent],
})
export class PracticeModule {}
