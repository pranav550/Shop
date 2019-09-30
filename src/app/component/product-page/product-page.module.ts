import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPageComponent } from './product-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Routes, RouterModule } from '@angular/router';
import { Ng2CarouselamosModule } from 'ng2-carouselamos';
import { NgImageSliderModule } from 'ng-image-slider';
import { LoadingModule } from './../../commoncomponent/loading/loading.module';

const routes: Routes = [
  {
    path: '',
    component: ProductPageComponent
  }
]
@NgModule({
  declarations: [ProductPageComponent],
  imports: [
    CommonModule,
    Ng2CarouselamosModule,
    NgImageSliderModule,
    LoadingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    ProductPageComponent
  ]
})
export class ProductPageModule { }
