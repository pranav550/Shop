import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressComponent } from './address.component';
import { Routes, RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingModule } from './../../commoncomponent/loading/loading.module';


const routes: Routes = [
  {
    path: '',
    component: AddressComponent
  }
]
@NgModule({
  declarations: [AddressComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingModule,
    RouterModule.forChild(routes)
  ]
})
export class AddressModule { }
