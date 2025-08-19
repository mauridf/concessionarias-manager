import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  nome: string;
  email: string;
  senha: string;
  role: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  getUsers(page = 0, size = 10, sort = 'nome,asc', search?: string): Observable<Page<User>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<Page<User>>(`${environment.apiUrl}/users`, { 
      params,
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  getUsersByRole(role: string, page = 0, size = 10, sort = 'nome,asc'): Observable<Page<User>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<Page<User>>(`${environment.apiUrl}/users/role/${role}`, { 
      params,
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/users/${id}`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  createUser(user: any): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/register`, user, {
        headers: this.getHeaders(),
        withCredentials: true
    });
  }

    updateUser(id: string, user: any): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/users/${id}`, user, {
        headers: this.getHeaders(),
        withCredentials: true
    });
  }
}
