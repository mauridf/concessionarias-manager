import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Veiculo {
  id: string;
  marca: string;
  modelo: string;
  versao: number;
  anoFabricacao: number;
  anoModelo: number;
  categoria: string;
  tipoVeiculo: string;
  combustivel: string;
  cambio: string;
  cor: string;
  preco: number;
  statusVeiculo: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({ providedIn: 'root' })
export class VeiculoService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  getVeiculos(
    page = 0,
    size = 10,
    sort = 'marca,asc',
    filtros?: {
      marca?: string;
      modelo?: string;
      tipoVeiculo?: string;
      categoria?: string;
      combustivel?: string;
      cambio?: string;
    }
  ): Observable<Page<Veiculo>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) {
          params = params.set(key, value);
        }
      });
    }

    return this.http.get<Page<Veiculo>>(`${environment.apiUrl}/veiculos`, {
      params,
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  getMarcas(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/veiculos/marcas`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  getModelos(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/veiculos/modelos`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  getVeiculoById(id: string): Observable<Veiculo> {
    return this.http.get<Veiculo>(`${environment.apiUrl}/veiculos/${id}`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  createVeiculo(veiculo: Partial<Veiculo>): Observable<Veiculo> {
    return this.http.post<Veiculo>(`${environment.apiUrl}/veiculos`, veiculo, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  updateVeiculo(id: string, veiculo: Partial<Veiculo>): Observable<Veiculo> {
    return this.http.put<Veiculo>(`${environment.apiUrl}/veiculos/${id}`, veiculo, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  deleteVeiculo(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/veiculos/${id}`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  uploadFoto(id: string, arquivo: File): Observable<string> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);

    return this.http.post(`${environment.apiUrl}/veiculos/${id}/foto`, formData, {
      responseType: 'text',
      withCredentials: true
    });
  }

  getImagem(nomeArquivo: string): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/veiculos/capas/${nomeArquivo}`, {
      responseType: 'blob',
      withCredentials: true
    });
  }
}
