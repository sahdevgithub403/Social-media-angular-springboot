import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommentPayload } from './comment.payload';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly baseUrl = 'http://localhost:8080/api/comments';

  constructor(private httpClient: HttpClient) {}

  private getAuthHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('authenticationToken')}`,
    });
  }

  getAllCommentsForPost(postId: number): Observable<CommentPayload[]> {
    return this.httpClient
      .get<CommentPayload[]>(`${this.baseUrl}/by-post/${postId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error(`Error fetching comments for post ${postId}:`, error);
          return throwError(() => new Error(error.message));
        })
      );
  }

  postComment(commentPayload: CommentPayload): Observable<any> {
    console.log('Sending Comment:', commentPayload); 
    return this.httpClient
      .post<any>(this.baseUrl, commentPayload, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Error posting comment:', error);
          return throwError(() => new Error(error.message));
        })
      );
  }
  

  getAllCommentsByUser(name: string): Observable<CommentPayload[]> {
    return this.httpClient
      .get<CommentPayload[]>(`${this.baseUrl}/by-user/${name}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error(`Error fetching comments for user ${name}:`, error);
          return throwError(() => new Error(error.message));
        })
      );
  }
}
