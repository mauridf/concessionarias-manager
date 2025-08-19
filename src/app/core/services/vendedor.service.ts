import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Vendedor {
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
export class VendedorService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  listarVendedores(page: number = 0, size: number = 10, search?: string): Observable<Page<Vendedor>> {
    let params = `?page=${page}&size=${size}`;
    if (search) {
      params += `&nome=${encodeURIComponent(search)}`;
    }

    return this.http.get<Page<Vendedor>>(`${environment.apiUrl}/vendedores${params}`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  buscarVendedorPorId(id: string): Observable<Vendedor> {
    return this.http.get<Vendedor>(`${environment.apiUrl}/vendedores/${id}`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  criarVendedor(vendedor: Partial<Vendedor>): Observable<Vendedor> {
    return this.http.post<Vendedor>(`${environment.apiUrl}/vendedores`, vendedor, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  atualizarVendedor(id: string, vendedor: Partial<Vendedor>): Observable<Vendedor> {
    return this.http.put<Vendedor>(`${environment.apiUrl}/vendedores/${id}`, vendedor, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  excluirVendedor(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/vendedores/${id}`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }
}
