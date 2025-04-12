import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SubredditService } from '../subreddit.service';
import { SubredditModel } from '../subreddit-response';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-create-subreddit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-subreddit.component.html',
  styleUrls: ['./create-subreddit.component.css']
})
export class CreateSubredditComponent implements OnInit {
  createSubredditForm: FormGroup;
  subredditModel: SubredditModel;

  constructor(private router: Router, private subredditService: SubredditService) {
    this.createSubredditForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });

    this.subredditModel = {
      name: '',
      description: ''
    };
  }

  ngOnInit(): void {}

  discard(): void {
    this.router.navigateByUrl('/');
  }

  createSubreddit(): void {
    if (this.createSubredditForm.invalid) {
      console.log("Form is invalid");
      return;
    }

    this.subredditModel.name = this.createSubredditForm.get('title')!.value;
    this.subredditModel.description = this.createSubredditForm.get('description')!.value;

    this.subredditService.createSubreddit(this.subredditModel).subscribe({
      next: () => {
        console.log("Subreddit created successfully");
        this.router.navigate(['/list-subreddits']);
      },
      error: (error) => {
        console.error("Error creating subreddit:", error);
        throwError(error);
      }
    });
  }
}
