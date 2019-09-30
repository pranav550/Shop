import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './registration.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { LoadingModule } from './../../commoncomponent/loading/loading.module';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';



const routes: Routes = [
  {
    path: '',
    component: RegistrationComponent
  }
]

@NgModule({
  declarations: [RegistrationComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InternationalPhoneNumberModule,
    LoadingModule,
    RouterModule.forChild(routes)
  ]
})
export class RegistrationModule { }
