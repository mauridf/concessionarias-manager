import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface UserLoginResponse {
  token: string;
  nome: string;
  email: string;
  role: 'GERENTE' | 'VENDEDOR' | 'MECANICO';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storageKey = 'concessionarias_auth';
  public currentUser$ = new BehaviorSubject<UserLoginResponse | null>(this.getStoredUser());

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, senha: string) {
    // atenção: ajusta o corpo se seu backend usa outro campo (ex: password)
    return this.http.post<UserLoginResponse>(`${environment.apiUrl}/auth/login`, { email, senha })
      .pipe(tap(res => {
        localStorage.setItem(this.storageKey, JSON.stringify(res));
        this.currentUser$.next(res);
      }));
  }

  logout() {
    localStorage.removeItem(this.storageKey);
    this.currentUser$.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    const s = localStorage.getItem(this.storageKey);
    return s ? (JSON.parse(s) as UserLoginResponse).token : null;
  }

  getUser(): UserLoginResponse | null {
    return this.currentUser$.value;
  }

  private getStoredUser(): UserLoginResponse | null {
    const s = localStorage.getItem(this.storageKey);
    return s ? JSON.parse(s) as UserLoginResponse : null;
  }
}