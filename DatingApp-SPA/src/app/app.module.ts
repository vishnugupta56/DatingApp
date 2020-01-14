import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule , TabsModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxGalleryModule } from 'ngx-gallery';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AuthService } from './_Services/Auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProvidor } from './_Services/error.interceptor';
import { MessagesComponent } from './Messages/Messages.component';
import { MemberListComponent } from './Members/Member-list/Member-list.component';
import { ListsComponent } from './lists/lists.component';
import { AppRoutes } from './routes';
import { MemberCardComponent } from './Members/Member-Card/Member-Card.component';
import { MemberDetailComponent } from './Members/member-detail/member-detail.component';
import { MemberEditComponent } from './Members/Member-edit/Member-edit.component';
import { MemberDetailResolver } from './_resolvers/member-Detail.resolver';
import { MemberlistResolver } from './_resolvers/members-list.resolver';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { UnsavedChangesPrompt } from './_guards/member-edit.guard';


// Auto Inject token to all Http Request
export function token() {
 return localStorage.getItem('Token');
}
// This class we add to avoid Error. "class constructors must be invoked with 'new'"
export class CustomHammerConfig extends HammerGestureConfig  {
   overrides = {
       pinch: { enable: false },
       rotate: { enable: false }
   };
}

@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      MessagesComponent,
      MemberListComponent,
      ListsComponent,
      MemberCardComponent,
      MemberDetailComponent,
      MemberEditComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      FormsModule,
      BsDropdownModule.forRoot(),
      TabsModule.forRoot(),
      NgxGalleryModule,
      RouterModule.forRoot(AppRoutes),
      JwtModule.forRoot({
         config: {
            tokenGetter: token,
            whitelistedDomains : ['localhost:5000'],
            blacklistedRoutes : ['localhost:5000/api/UserAuth']

         }
      })
   ],
   providers: [
      AuthService,
      ErrorInterceptorProvidor,
      MemberDetailResolver,
      MemberlistResolver,
      MemberEditResolver,
      UnsavedChangesPrompt,
      { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig }
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
