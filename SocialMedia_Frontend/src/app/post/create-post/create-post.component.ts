import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { CreatePostPayload } from './create-post.payload';
import { SubredditModel } from '../../subreddit/subreddit-response';
import { SubredditService } from '../../subreddit/subreddit.service';
import { PostService } from '../../shared/post.service';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,EditorModule],
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  createPostForm!: FormGroup;
  postPayload: CreatePostPayload;
  subreddits: Array<SubredditModel> = []; 

  constructor(
    private router: Router,
    private postService: PostService,
    private subredditService: SubredditService,
    private toastr: ToastrService
  ) {
    this.postPayload = {
      postName: '',
      url: '',
      description: '',
      subredditName: ''
    };
  }

  ngOnInit() {
    this.createPostForm = new FormGroup({
      postName: new FormControl('', Validators.required),
      subredditName: new FormControl('', Validators.required),
      url: new FormControl(''),
      description: new FormControl('', Validators.required),
    });

    this.subredditService.getAllSubreddits().pipe(
      catchError(error => {
        console.error('Error fetching subreddits:', error);
        return of([]); 
      })
    ).subscribe(data => {
      this.subreddits = data;
    });
  }

  createPost() {
    this.postPayload = {
      postName: this.createPostForm.get('postName')?.value || '',
      subredditName: this.createPostForm.get('subredditName')?.value || '',
      url: this.createPostForm.get('url')?.value || '',
      description: this.createPostForm.get('description')?.value || ''
    };
    
    console.log('Sending Payload:', this.postPayload); 
    this.postService.createPost(this.postPayload).subscribe({
      next: () => {
        this.toastr.success('Post Created Successfully!');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error creating post:', error);
        this.toastr.error('Failed to create post. Try again!');
      }
    });
  }

  discardPost() {
    this.router.navigateByUrl('/');
  }
}