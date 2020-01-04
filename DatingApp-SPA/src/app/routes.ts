import { Routes } from '@angular/router';
import { HomeComponent } from '../app/home/home.component';
import { MessagesComponent } from './Messages/Messages.component';
import { ListsComponent } from './lists/lists.component';
import { MemberListComponent } from './Member-list/Member-list.component';
import { AuthGuard } from './_guards/auth.guard';

export const AppRoutes: Routes = [
  {path: '', component: HomeComponent },
  {path: 'home', component: HomeComponent },
  {path: '',
   runGuardsAndResolvers: 'always',
   canActivate: [AuthGuard],
   children: [
    {path: 'messages', component: MessagesComponent},
    {path: 'lists', component: ListsComponent },
    {path: 'memberslists', component: MemberListComponent, canActivate: [AuthGuard]}
   ] },
  {path: '**', redirectTo: '', pathMatch: 'full'}
];
