import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { VotePayload } from './vote-button/vote-payload';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  private BASE_URL = 'http://localhost:8080/api/votes/';

  constructor(private http: HttpClient) { }

  vote(votePayload: VotePayload): Observable<any> {
    const token = sessionStorage.getItem('authenticationToken');

    if (!token) {
      console.error('No authentication token found.');
      return throwError(() => new Error('User not authenticated')); 
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    });

    return this.http.post(this.BASE_URL, votePayload, { headers });
  }
}
