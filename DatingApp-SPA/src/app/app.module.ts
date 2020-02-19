import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule , TabsModule, BsDatepickerModule, PaginationModule, ButtonsModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxGalleryModule } from 'ngx-gallery';
import { FileUploadModule } from 'ng2-file-upload';
import { TimeAgoPipe } from 'time-ago-pipe';

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
import { PhotoEditorComponent } from './Members/photo-editor/photo-editor.component';
import { ListsResolver } from './_resolvers/lists.resolver';



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
      MemberEditComponent,
      PhotoEditorComponent,
      TimeAgoPipe
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      PaginationModule.forRoot(),
      BsDatepickerModule.forRoot(),
      BsDropdownModule.forRoot(),
      TabsModule.forRoot(),
      ButtonsModule.forRoot(),
      NgxGalleryModule,
      FileUploadModule,
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
      ListsResolver,
      { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig }
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
