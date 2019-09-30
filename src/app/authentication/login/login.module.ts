import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingModule } from './../../commoncomponent/loading/loading.module';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  }
]
@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingModule,
    RouterModule.forChild(routes)
  ]
})
export class LoginModule { }
