import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable, map, catchError, throwError, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginRequestPayload } from '../login/login-request.payload';
import { LoginResponse } from '../login/login-response.payload';
import { SignupRequestPayload } from '../signup/singup-request.payload';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private baseUrl = 'http://localhost:8080/api/auth';

  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() username: EventEmitter<string> = new EventEmitter();

  private authenticationToken: string | null = null;
  private refreshTokenString: string | null = null;
  private expiresAt: number | null = null;
  private userName: string | null = null;

  constructor(private httpClient: HttpClient) {
    if (typeof window !== 'undefined') {
      this.loadAuthDataFromSession();
    }
  }

  private loadAuthDataFromSession(): void {
    if (typeof window !== 'undefined') {
      this.authenticationToken = sessionStorage.getItem('authenticationToken');
      this.refreshTokenString = sessionStorage.getItem('refreshToken');
      this.userName = sessionStorage.getItem('username');
      this.expiresAt = Number(sessionStorage.getItem('expiresAt'));
    }
  }

  signup(signupRequestPayload: SignupRequestPayload): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/signup`, signupRequestPayload, {
      responseType: 'text',
    });
  }

  login(loginRequestPayload: LoginRequestPayload): Observable<boolean> {
    return this.httpClient.post<LoginResponse>(`${this.baseUrl}/login`, loginRequestPayload).pipe(
      map((data) => {
        this.storeAuthData(data);
        this.loggedIn.emit(true);
        this.username.emit(data.username);
        console.log('AuthService: Username emitted →', data.username);
        return true;
      }),
      catchError(() => {
        return throwError(() => new Error('Login failed. Please try again.'));
      })
    );
  }

  googleLogin(idToken: string): Observable<any> {
    return this.httpClient.get<LoginResponse>(`${this.baseUrl}/oauth/google`, {
      params: { token: idToken },
    }).pipe(
      tap(response => {
        this.storeAuthData(response); 
        this.loggedIn.emit(true);      
        this.username.emit(response.username);
      }),
      catchError((error) => {
        console.error('Google login failed:', error);
        return throwError(() => new Error('Google login failed'));
      })
    );
  }
  

  getJwtToken(): string | null {
    return typeof window !== 'undefined' ? sessionStorage.getItem('authenticationToken') : null;
  }

  // getUserName(): string | null{
  //   return typeof window !== 'undefined' ? sessionStorage.getItem('username') : null;
  // }

  getUserName(): string | null {
    const username = typeof window !== 'undefined' ? sessionStorage.getItem('username') : null;
    console.log('AuthService: Retrieved username →', username);
    return username;
  }

  isTokenExpired(): boolean {
    if (!this.expiresAt) return true;
    return Date.now() > this.expiresAt;
  }

  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    const token = sessionStorage.getItem('authenticationToken');
    console.log('AuthService: Checking token existence', token ? '✅ Exists' : '❌ Not Found');
    
    return token !== null;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('authenticationToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('expiresAt');
      sessionStorage.removeItem('username');
    }
    this.authenticationToken = null;
    this.refreshTokenString = null;
    this.expiresAt = null;
    this.userName = null;
    this.loggedIn.emit(false);
    this.username.emit('');
  }

  refreshToken(): Observable<LoginResponse> {
    if (typeof window === 'undefined') return throwError(() => new Error('sessionStorage not available'));

    return this.httpClient
      .post<LoginResponse>(`${this.baseUrl}/refresh`, {
        refreshToken: sessionStorage.getItem('refreshToken'),
        username: sessionStorage.getItem('username'),
      })
      .pipe(
        map((data) => {
          this.storeAuthData(data);
          return data;
        }),
        catchError(() => {
          this.logout();
          return throwError(() => new Error('Token refresh failed. Please log in again.'));
        })
      );
  }

  private storeAuthData(data: LoginResponse): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('authenticationToken', data.authenticationToken);
      sessionStorage.setItem('refreshToken', data.refreshToken);
      sessionStorage.setItem('expiresAt', data.expiresAt.toString());
      sessionStorage.setItem('username', data.username);
    }
    this.authenticationToken = data.authenticationToken;
    this.refreshTokenString = data.refreshToken;
    this.expiresAt = Number(data.expiresAt);
    this.userName = data.username;

    console.log('AuthService: Storing user data →', {
      authenticationToken: data.authenticationToken,
      refreshToken: data.refreshToken,
      expiresAt: data.expiresAt,
      username: data.username,
    });
  }
}