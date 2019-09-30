import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { componentComponent } from './component/component.component';
import { PageNotFoundComponent } from './authentication/page-not-found/page-not-found.component';

const routes: Routes = [

  {
    path: 'login',
    loadChildren: './authentication/login/login.module#LoginModule'
  },
  {
    path: 'registration',
    loadChildren: './authentication/registration/registration.module#RegistrationModule'
  },
  {
    path: 'forget-password',
    loadChildren: './authentication/forgot-password/forgot-password.module#ForgotPasswordModule'
  },
  {
    path: 'reset-password',
    loadChildren: './authentication/reset-password/reset-password.module#ResetPasswordModule'
  },
  {
    path: 'change-password',
    loadChildren: './authentication/change-password/change-password.module#ChangePasswordModule'
  },
  {
    path: '', component: componentComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'product/:name/:_id',
        loadChildren: './component/product-list/product-list.module#ProductListModule'
      },
      {
        path: 'product/:name/:_id/product/:selected_custom_id/:brand_name',
        loadChildren: './component/product-page/product-page.module#ProductPageModule'
      },
{
        path: 'profile',
        loadChildren: './component/profile/profile.module#ProfileModule'
      },
      {
        path: 'card-details',
        loadChildren: './component/save-card/save-card.module#SaveCardModule'
      },
      {
        path: 'my-order',
        loadChildren: './component/my-order/my-order.module#MyOrderModule'
      },
      {
        path: 'address',
        loadChildren: './component/address/address.module#AddressModule'
      },
      {
        path: 'shopping-cart',
        loadChildren: './component/shopping-cart/shopping-cart.module#ShoppingCartModule'
      },
      {
        path: 'wishlist',
        loadChildren: './component/whislist/whislist.module#WhislistModule'
      },
      {
        path: 'checkout',
        loadChildren: './component/checkout/checkout.module#CheckoutModule'
      }
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
