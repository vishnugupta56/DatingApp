import { Routes } from '@angular/router';
import { HomeComponent } from '../app/home/home.component';
import { MessagesComponent } from './Messages/Messages.component';
import { ListsComponent } from './lists/lists.component';
import { MemberListComponent } from './Members/Member-list/Member-list.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './Members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-Detail.resolver';
import { MemberlistResolver } from './_resolvers/members-list.resolver';

export const AppRoutes: Routes = [
  {path: '', component: HomeComponent },
  {path: 'home', component: HomeComponent },
  {path: '',
   runGuardsAndResolvers: 'always',
   canActivate: [AuthGuard],
   children: [
    {path: 'messages', component: MessagesComponent},
    {path: 'lists', component: ListsComponent },
    {path: 'memberslists', component: MemberListComponent, resolve: {users: MemberlistResolver}},
    {path: 'memberslists/:id', component: MemberDetailComponent, resolve: {user: MemberDetailResolver}}
   ] },
  {path: '**', redirectTo: '', pathMatch: 'full'}
];
