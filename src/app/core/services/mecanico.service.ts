import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Mecanico {
  id: string;          // UUID
  usuarioId: string;   // UUID do usuário
  nome: string;
  ativo: boolean;

  // Dados do usuário
  usuarioNome?: string;
  usuarioEmail?: string;
  usuarioRole?: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({ providedIn: 'root' })
export class MecanicoService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  listarMecanicos(page: number = 0, size: number = 10, search?: string): Observable<Page<Mecanico>> {
    let params = `?page=${page}&size=${size}`;
    if (search) {
      params += `&nome=${encodeURIComponent(search)}`;
    }

    return this.http.get<Page<Mecanico>>(`${environment.apiUrl}/mecanicos${params}`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  buscarMecanicoPorId(id: string): Observable<Mecanico> {
    return this.http.get<Mecanico>(`${environment.apiUrl}/mecanicos/${id}`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  criarMecanico(mecanico: Partial<Mecanico>): Observable<Mecanico> {
    return this.http.post<Mecanico>(`${environment.apiUrl}/mecanicos`, mecanico, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  atualizarMecanico(id: string, mecanico: Partial<Mecanico>): Observable<Mecanico> {
    return this.http.put<Mecanico>(`${environment.apiUrl}/mecanicos/${id}`, mecanico, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  excluirMecanico(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/mecanicos/${id}`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }
}
