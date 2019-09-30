import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordComponent } from './reset-password.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { LoadingModule } from './../../commoncomponent/loading/loading.module';


const routes: Routes = [
  {
    path: '',
    component: ResetPasswordComponent
  }
]
@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingModule,
    RouterModule.forChild(routes)
  ]
})
export class ResetPasswordModule { }
