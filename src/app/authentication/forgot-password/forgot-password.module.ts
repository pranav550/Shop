import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from './forgot-password.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { LoadingModule } from './../../commoncomponent/loading/loading.module';



const routes: Routes = [
  {
    path: '',
    component: ForgotPasswordComponent
  }
]
@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingModule,
    RouterModule.forChild(routes)
  ]
})
export class ForgotPasswordModule { }
