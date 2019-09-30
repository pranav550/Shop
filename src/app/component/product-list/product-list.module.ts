import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product-list.component';
import { Routes, RouterModule } from '@angular/router';
import { LoadingModule } from './../../commoncomponent/loading/loading.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng5SliderModule } from 'ng5-slider';
import {FormsModule} from '@angular/forms';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';


const routes: Routes = [
  {
    path: '',
    component: ProductListComponent
  },
  
]

@NgModule({
  declarations: [ProductListComponent],
  imports: [
    CommonModule,
    LoadingModule,
    NgbModule,
    Ng5SliderModule,
    FormsModule,
    RouterModule.forChild(routes),
    MalihuScrollbarModule.forRoot(),
  ]
})
export class ProductListModule { }
