import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhislistComponent } from './whislist.component';
import { Routes, RouterModule } from '@angular/router';
import { LoadingModule } from './../../commoncomponent/loading/loading.module';

const routes: Routes = [
  {
    path: '',
    component: WhislistComponent
  }
]

@NgModule({
  declarations: [WhislistComponent],
  imports: [
    CommonModule,
    LoadingModule,
    RouterModule.forChild(routes)
  ]
})
export class WhislistModule { }
