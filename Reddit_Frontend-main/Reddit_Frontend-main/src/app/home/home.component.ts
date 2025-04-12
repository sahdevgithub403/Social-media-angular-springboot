import { Component, OnInit } from '@angular/core';
import { PostModel } from '../shared/post-model';
import { PostService } from '../shared/post.service';
import { PostTileComponent } from '../shared/post-tile/post-tile.component';
import { SideBarComponent } from '../shared/side-bar/side-bar.component';
import { SubredditSideBarComponent } from '../shared/subreddit-side-bar/subreddit-side-bar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [PostTileComponent, SideBarComponent, SubredditSideBarComponent]
})
export class HomeComponent implements OnInit {
  posts: PostModel[] = [];
  errorMessage: string | null = null;

  constructor(private postService: PostService) {
    this.loadPosts();
  }

  ngOnInit(): void {}

  private loadPosts(): void {
    this.postService.getAllPosts().subscribe({
      next: (posts) => {
        console.log('Fetched Posts:', posts);
        this.posts = posts;
      },
      error: (err) => {
        console.error('Error in subscription:', err);
        this.errorMessage = 'Failed to load posts. Please try again later.';
      }
    });
  }
}