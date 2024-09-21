import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HarmonyComponent } from './practice/harmony/harmony.component';

const routes: Routes = [
  {
    path: '',
    component: HarmonyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
