import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { faComment, faTrash } from '@fortawesome/free-solid-svg-icons';
import { PostModel } from '../post-model';
import { ToastrService } from 'ngx-toastr';
import { PostService } from '../post.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog/confirm-dialog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { VoteButtonComponent } from "../vote-button/vote-button.component";

@Component({
  selector: 'app-post-tile',
  standalone: true,
  templateUrl: './post-tile.component.html',
  styleUrls: ['./post-tile.component.css'],
  imports: [FontAwesomeModule, CommonModule, MatDialogModule, VoteButtonComponent]
})
export class PostTileComponent {
  faComments = faComment;
  faTrash = faTrash;

  @Input() posts: PostModel[] = [];
  @Input() showDelete: boolean = false;

  constructor(
    private router: Router,
    private postService: PostService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {}

  goToPost(id: number): void {
    this.router.navigateByUrl('/view-post/' + id);
  }

  toggleDescription(post: PostModel): void {
    post.expanded = !post.expanded;
  }

  isLongDescription(desc: string | undefined): boolean {
    return !!desc && desc.length > 300;
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  deletePost(postId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.postService.deletePost(postId).subscribe({
          next: () => {
            this.posts = this.posts.filter(post => post.id !== postId);
            this.toastr.success('Post deleted successfully.');
          },
          error: (error: any) => {
            console.error('Error deleting post:', error);
            this.toastr.error('Failed to delete post.');
          }
        });
      }
    });
  }
}
