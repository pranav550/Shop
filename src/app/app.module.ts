import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
// import { ProductPageComponent } from './component/product-page/product-page.component';
import { HeaderComponent } from './commoncomponent/header/header.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { componentComponent } from './component/component.component'
import { TokenInterceptorService } from './interceptor/token-interceptor.service';
import { AuthGuard } from './authguard/auth.guard';
import { PageNotFoundComponent } from './authentication/page-not-found/page-not-found.component';
import { SocialLoginModule } from 'angularx-social-login';
import { AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, } from 'angularx-social-login';
import { LoadingModule } from './commoncomponent/loading/loading.module';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2CarouselamosModule } from 'ng2-carouselamos';
import { NgImageSliderModule } from 'ng-image-slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ng6-toastr-notifications';


/**config for gmail and fb  */
let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("895849718412-iceos65hqa7b0bh54hdhqrjohbcvoeos.apps.googleusercontent.com")
    //  for local ('895849718412-lpjpbnbq9kmi454tq1c3mho35ijvps72.apps.googleusercontent.com')
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("451580518914486")
  }
])

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    componentComponent,
    PageNotFoundComponent,
   ],
   
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    SocialLoginModule,
    LoadingModule,
    InternationalPhoneNumberModule,
    Ng2CarouselamosModule,
    NgImageSliderModule,
    BrowserAnimationsModule, ToastrModule.forRoot(),
    NgbModule.forRoot(),
    
  ],
  providers: [RouterModule, AuthGuard,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent],
})
export class AppModule {


}
