import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostModel } from '../../shared/post-model';
import { PostService } from '../../shared/post.service';
import { CommentPayload } from '../../Comment/comment.payload';
import { CommentService } from '../../Comment/comment.service';
import { VoteButtonComponent } from '../../shared/vote-button/vote-button.component';
import { AuthService } from '../../auth/shared/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, VoteButtonComponent,FontAwesomeModule],
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css'],
})
export class ViewPostComponent implements OnInit {
  faComments = faComment;
  postId!: number;
  post: PostModel | null = null;
  commentForm: FormGroup = new FormGroup({
    text: new FormControl('', Validators.required),
  });
  comments: CommentPayload[] = [];
  username: string = '';

  constructor(
     private router: Router,
    private postService: PostService,
    private activateRoute: ActivatedRoute,
    private commentService: CommentService,
    private authService: AuthService
  ) {}

  
  ngOnInit(): void {
    
    this.postId = Number(this.activateRoute.snapshot.paramMap.get('id'));
    this.getPostById();
    this.getCommentsForPost();
    this.username = this.authService.getUserName() || '';
    console.log('After fetching username:', this.username);
  }

  goToPost(id: number): void {
    this.router.navigateByUrl('/view-post/' + id);
  }

  postComment() {
    if (this.commentForm.invalid) {
      return;
    }
    const commentPayload: CommentPayload = {
      text: this.commentForm.value.text,
      postId: this.postId,
      username: this.username, 
      duration: '', 
    };

    console.log('Username ', this.username);

    console.log('Sending Comment Payload:', commentPayload);

    this.commentService.postComment(commentPayload).subscribe({
      next: (response) => {
        console.log('Success:', response.message); 
        this.commentForm.reset();
        this.getCommentsForPost();
      },
      error: (error) => console.error('Error posting comment:', error),
    });
  }


  private getPostById() {
    this.postService.getPost(this.postId).subscribe({
      next: (data) => (this.post = data),
      error: (error) => {
        console.error('Error fetching post:', error);
        this.post = null;
      },
    });
  }

  private getCommentsForPost() {
    this.commentService.getAllCommentsForPost(this.postId).subscribe({
      next: (data) => (this.comments = data),
      error: (error) => console.error('Error fetching comments:', error),
    });
  }
}
