import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8081/api';

  // Métodos de Categorias
  listarCategorias() { return this.http.get(`${this.API}/categorias`); }
  criarCategoria(data: any) { return this.http.post(`${this.API}/categorias`, data); }
  atualizarCategoria(idCategoria: number, data: any) { return this.http.put(`${this.API}/categorias/${idCategoria}`, data); }
  deletarCategoria(idCategoria: number) { return this.http.delete(`${this.API}/categorias/${idCategoria}`); }

  // Métodos de Lançamentos
  listarLancamentos() { return this.http.get(`${this.API}/lancamentos`); }
  criarLancamento(data: any) { return this.http.post(`${this.API}/lancamentos`, data); }
  atualizarLancamento(idLancamento: number, data: any) { return this.http.put(`${this.API}/lancamentos/${idLancamento}`, data); }
  deletarLancamento(idLancamento: number) { return this.http.delete(`${this.API}/lancamentos/${idLancamento}`); }
}
