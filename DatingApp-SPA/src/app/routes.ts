import { Routes } from '@angular/router';
import { HomeComponent } from '../app/home/home.component';
import { MessagesComponent } from './Messages/Messages.component';
import { ListsComponent } from './lists/lists.component';
import { MemberListComponent } from './Members/Member-list/Member-list.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './Members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-Detail.resolver';
import { MemberlistResolver } from './_resolvers/members-list.resolver';
import { MemberEditComponent } from './Members/Member-edit/Member-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { UnsavedChangesPrompt } from './_guards/member-edit.guard';
import { ListsResolver } from './_resolvers/lists.resolver';
import { MessagesResolver } from './_resolvers/messages.resolver';

export const AppRoutes: Routes = [
  {path: '', component: HomeComponent },
  {path: 'home', component: HomeComponent },
  {path: '',
   runGuardsAndResolvers: 'always',
   canActivate: [AuthGuard],
   children: [
    {path: 'messages', component: MessagesComponent, resolve: {messages : MessagesResolver}},
    {path: 'lists', component: ListsComponent, resolve: {users: ListsResolver} },
    {path: 'memberslists', component: MemberListComponent, resolve: {users: MemberlistResolver}},
    {path: 'memberslists/:id', component: MemberDetailComponent, resolve: {user: MemberDetailResolver}},
    {path: 'member/edit', component: MemberEditComponent, resolve: {user : MemberEditResolver }, canDeactivate: [UnsavedChangesPrompt]},

   ] },
  {path: '**', redirectTo: '', pathMatch: 'full'}
];
