import { Component, OnInit } from '@angular/core';
import { SubredditModel } from '../subreddit-response';
import { SubredditService } from '../subreddit.service';
import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-subreddits',
  templateUrl: './list-subreddits.component.html',
  styleUrls: ['./list-subreddits.component.css'],
  imports: [CommonModule]
})
export class ListSubredditsComponent implements OnInit {

  subreddits!: Array<SubredditModel>;
  constructor(private subredditService: SubredditService) { }

  ngOnInit() {
    this.subredditService.getAllSubreddits().subscribe(data => {
      console.log('API Response:', data); 
      this.subreddits = data;
      
    }, error => {
      throwError(error);
    })
  }
}