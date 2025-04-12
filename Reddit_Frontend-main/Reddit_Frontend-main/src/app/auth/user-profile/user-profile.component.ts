import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostModel } from '../../shared/post-model';
import { CommentPayload } from '../../Comment/comment.payload';
import { CommentService } from '../../Comment/comment.service';
import { PostService } from '../../shared/post.service';
import { CommonModule } from '@angular/common';
import { PostTileComponent } from '../../shared/post-tile/post-tile.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  standalone: true,
  imports: [PostTileComponent, CommonModule, FontAwesomeModule]
})
export class UserProfileComponent implements OnInit {
  name: string = '';
  posts: PostModel[] = [];
  comments: CommentPayload[] = [];
  postLength: number = 0;
  commentLength: number = 0;
  faPlus = faPlus;

  profilePhotoUrl: string | null = null;
  defaultPhoto: string = 'assets/default-user.png';
  editing: boolean = false;
  activeTab: string = 'overview';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.name = params.get('name') ?? '';
      if (this.name) {
        this.fetchUserPosts();
        this.fetchUserComments();

        // Load saved profile photo from sessionStorage
        const savedPhoto = sessionStorage.getItem('profilePhoto_' + this.name);
        if (savedPhoto) {
          this.profilePhotoUrl = savedPhoto;
        }
      }
    });
  }

  fetchUserPosts(): void {
    this.postService.getAllPostsByUser(this.name).subscribe(data => {
      this.posts = data;
      this.postLength = data.length;
    });
  }

  fetchUserComments(): void {
    this.commentService.getAllCommentsByUser(this.name).subscribe(data => {
      this.comments = data;
      this.commentLength = data.length;
    });
  }

  goToCreatePost() {
    this.router.navigateByUrl('/create-post'); 
  }

  toggleEdit() {
    this.editing = true;
  }

  cancelEdit() {
    this.editing = false;
  }

  saveChanges() {
    this.editing = false;
  }

  onPhotoSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        const result = e.target.result;
        if (typeof result === 'string') {
          this.profilePhotoUrl = result;
          sessionStorage.setItem('profilePhoto_' + this.name, result);
        }
      };
  
      reader.readAsDataURL(file);
    }
  }
  
}
