import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UsuarioCadastro, UsuarioLogin, AuthResponse } from '../models/interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8081/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private router = inject(Router);

  cadastrar(usuario: UsuarioCadastro): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/cadastrar`, usuario);
  }

  login(credenciais: UsuarioLogin): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credenciais).pipe(
      tap(res => this.saveToken(res.token))
    );
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null && token !== undefined && token !== '';
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }
}