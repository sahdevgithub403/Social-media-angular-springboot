import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PostModel } from './post-model';
import { CreatePostPayload } from '../post/create-post/create-post.payload';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private baseUrl = 'http://localhost:8080/api/posts';

  constructor(private httpClient: HttpClient) {}

  private getAuthHeaders() {
    const token = sessionStorage.getItem('authenticationToken');
    if (!token) {
      console.error('Auth token is missing!');
      return new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getAllPosts(): Observable<Array<PostModel>> {
    return this.httpClient
      .get<Array<PostModel>>(`${this.baseUrl}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching posts:', error);
          return of([]);
        })
      );
  }

  createPost(postPayload: CreatePostPayload): Observable<any> {
    return this.httpClient
      .post(`${this.baseUrl}`, postPayload, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error creating post:', error);
          return of(null);
        })
      );
  }

  getPost(id: number): Observable<PostModel> {
    return this.httpClient
      .get<PostModel>(`${this.baseUrl}/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error(`Error fetching post with ID ${id}:`, error);
          return of(null as unknown as PostModel);
        })
      );
  }

  getAllPostsByUser(username: string): Observable<PostModel[]> {
    return this.httpClient
      .get<PostModel[]>(`${this.baseUrl}/by-user/${username}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error(`Error fetching posts for user ${username}:`, error);
          return of([]);
        })
      );
  }

  deletePost(postId: number): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.baseUrl}/${postId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error(`Error deleting post with ID ${postId}:`, error);
          return of();
        })
      );
  }
}