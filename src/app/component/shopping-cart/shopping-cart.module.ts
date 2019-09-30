import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartComponent } from './shopping-cart.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingModule } from './../../commoncomponent/loading/loading.module';

const routes: Routes = [
  {
    path: '',
    component: ShoppingCartComponent
  }
]

@NgModule({
  declarations: [ShoppingCartComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingModule,
    RouterModule.forChild(routes)
  ]
})
export class ShoppingCartModule { }
