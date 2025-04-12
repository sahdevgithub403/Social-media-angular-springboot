import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { CreatePostComponent } from './post/create-post/create-post.component';
import { CreateSubredditComponent } from './subreddit/create-subreddit/create-subreddit.component';
import { authGuard} from './auth/auth.guard';
import { UserProfileComponent } from './auth/user-profile/user-profile.component';
import { ViewPostComponent } from './post/view-post/view-post.component';
import { ListSubredditsComponent } from './subreddit/list-subreddits/list-subreddits.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create-post', component: CreatePostComponent, canActivate: [authGuard] },
  { path: 'create-subreddit', component: CreateSubredditComponent, canActivate: [authGuard] },
  { path: 'view-post/:id', component: ViewPostComponent },
  { path: 'user-profile/:name', component: UserProfileComponent, canActivate: [authGuard] },
  { path: 'list-subreddits', component: ListSubredditsComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
