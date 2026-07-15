import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  MatSnackBar } from '@angular/material/snack-bar';

import { Categoria, Lancamento } from '../models/interfaces'

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8081/api';

  // Métodos de Categorias
  listarCategorias(): Observable<Categoria[]> { 
    return this.http.get<Categoria[]>(`${this.API}/categorias`); 
  }
  criarCategoria(data: Categoria): Observable<Categoria> { 
    return this.http.post<Categoria>(`${this.API}/categorias`, data); 
  }
  atualizarCategoria(idCategoria: number, data: Categoria): Observable<Categoria> { 
    return this.http.put<Categoria>(`${this.API}/categorias/${idCategoria}`, data); 
  }
  deletarCategoria(idCategoria: number): Observable<void> { 
    return this.http.delete<void>(`${this.API}/categorias/${idCategoria}`); 
  }
  
  // Métodos de Lançamentos
  listarLancamentos(): Observable<Lancamento[]> { 
    return this.http.get<Lancamento[]>(`${this.API}/lancamentos`); 
  }
  criarLancamento(data: Lancamento): Observable<Lancamento> { 
    return this.http.post<Lancamento>(`${this.API}/lancamentos`, data); 
  }
  atualizarLancamento(idLancamento: number, data: Lancamento): Observable<Lancamento> { 
    return this.http.put<Lancamento>(`${this.API}/lancamentos/${idLancamento}`, data); 
  }
  deletarLancamento(idLancamento: number): Observable<void> { 
    return this.http.delete<void>(`${this.API}/lancamentos/${idLancamento}`); 
  }
}
