import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './change-password.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { LoadingModule } from './../../commoncomponent/loading/loading.module';


const routes: Routes = [
  {
    path: '',
    component: ChangePasswordComponent
  }
]


@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingModule,
    RouterModule.forChild(routes)
  ]
})
export class ChangePasswordModule { }
