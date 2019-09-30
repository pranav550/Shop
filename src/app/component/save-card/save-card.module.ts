import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaveCardComponent } from './save-card.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: SaveCardComponent
  }
]

@NgModule({
  declarations: [SaveCardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SaveCardModule { }
