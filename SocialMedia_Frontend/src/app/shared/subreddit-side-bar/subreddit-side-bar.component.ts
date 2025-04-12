import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubredditService } from '../../subreddit/subreddit.service';
import { SubredditModel } from '../../subreddit/subreddit-response';

@Component({
  selector: 'app-subreddit-side-bar',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './subreddit-side-bar.component.html',
  styleUrls: ['./subreddit-side-bar.component.css']
})
export class SubredditSideBarComponent {
  subreddits: Array<SubredditModel> = [];
  displayViewAll: boolean = false; 

  constructor(private subredditService: SubredditService) {
    this.subredditService.getAllSubreddits().subscribe(data => {
      console.log('Subreddits:', data);

      if (data.length > 3) {
        this.subreddits = data.slice(0, 3);
        this.displayViewAll = true;
      } else {
        this.subreddits = data;
        this.displayViewAll = false;
      }
    });
  }
}
