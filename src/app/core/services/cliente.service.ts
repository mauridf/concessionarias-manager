import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: string;
  dataNascimento?: Date;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({ providedIn: 'root' })
export class ClienteService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  listarClientes(page: number = 0, size: number = 10, search?: string): Observable<Page<Cliente>> {
    let params = `?page=${page}&size=${size}`;
    if (search) {
        params += `&nome=${encodeURIComponent(search)}`;
    }

    return this.http.get<Page<Cliente>>(`${environment.apiUrl}/clientes${params}`, {
    headers: this.getHeaders(),
    withCredentials: true
  });
  }

  buscarClientePorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${environment.apiUrl}/clientes/${id}`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  criarCliente(cliente: Partial<Cliente>): Observable<Cliente> {
    return this.http.post<Cliente>(`${environment.apiUrl}/clientes`, cliente, {
        headers: this.getHeaders(),
        withCredentials: true
    });
  }

    atualizarCliente(id: number, cliente: Partial<Cliente>): Observable<Cliente> {
    return this.http.put<Cliente>(`${environment.apiUrl}/clientes/${id}`, cliente, {
        headers: this.getHeaders(),
        withCredentials: true
    });
 }


  excluirCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/clientes/${id}`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }
}
