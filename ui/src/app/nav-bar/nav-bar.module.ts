import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainBarComponent } from './main-bar/main-bar.component';

@NgModule({
  declarations: [MainBarComponent],
  imports: [CommonModule],
  exports: [MainBarComponent],
})
export class NavBarModule {}
