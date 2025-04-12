import { Component, OnInit, Input } from '@angular/core';
import { PostModel } from '../post-model';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { VotePayload } from './vote-payload';
import { VoteType } from './vote-type';
import { VoteService } from '../vote.service';
import { PostService } from '../post.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/shared/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vote-button',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './vote-button.component.html',
  styleUrls: ['./vote-button.component.css'],
})
export class VoteButtonComponent implements OnInit {
  @Input() post!: PostModel;
  votePayload: VotePayload;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  upvoteColor: string = '';
  downvoteColor: string = '';
  isLoggedIn: boolean = false;


  constructor(
    private voteService: VoteService,
    private authService: AuthService,
    private postService: PostService,
    private toastr: ToastrService
  ) {
    this.votePayload = { voteType: undefined, postId: undefined };

    this.authService.loggedIn.subscribe({
      next: (data: boolean) => {
        this.isLoggedIn = data;
        console.log('User logged in status:', this.isLoggedIn);
      },
      error: (error: any) =>
        console.error('Error checking login status:', error),
    });
  }

  ngOnInit(): void {
    this.updateVoteDetails();
  }

  upvotePost() {
    console.log('Upvote button clicked');
    if (!this.validatePost()) return;
    this.votePayload.voteType = VoteType.UPVOTE;
    this.vote();
    this.downvoteColor = '';
  }

  downvotePost() {
    console.log('Downvote button clicked');
    if (!this.validatePost()) return;
    this.votePayload.voteType = VoteType.DOWNVOTE;
    this.vote();
    this.upvoteColor = '';
  }

  private vote() {
    if (!this.validatePost()) return;

    this.votePayload.postId = this.post.id;
    console.log('Sending vote payload:', this.votePayload);

    this.voteService.vote(this.votePayload).subscribe({
      next: () => {
        console.log('Vote success');
        this.updateVoteDetails();
      },
      error: (error) => {
        console.error('Vote error:', error);
        this.toastr.error(error.error.message);
      },
    });
  }

  private updateVoteDetails() {
    if (!this.validatePost()) return;

    this.postService.getPost(this.post.id).subscribe({
      next: (post) => {
        this.post = post;
      },
      error: (error) => this.toastr.error('Failed to update vote details'),
    });
  }

  private validatePost(): boolean {
    if (!this.post || this.post.id === undefined) {
      this.toastr.error('Post not found!');
      return false;
    }
    return true;
  }
}
