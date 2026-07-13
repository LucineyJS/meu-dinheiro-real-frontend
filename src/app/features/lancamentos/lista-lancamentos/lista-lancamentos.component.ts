import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Imports do Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Serviços e Interfaces do projeto
import { ApiService } from '../../../core/services/api.service';
import { Lancamento } from '../../../core/models/interfaces';

@Component({
  selector: 'app-lista-lancamentos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './lista-lancamentos.component.html',
  styleUrls: ['./lista-lancamentos.component.css']
})
export class ListaLancamentosComponent implements OnInit {
  private apiService = inject(ApiService);
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar);

  // Colunas que serão exibidas na tabela
  displayedColumns: string[] = ['descricao', 'valor', 'dataLancamento', 'acoes'];
  dataSource: Lancamento[] = [];
  carregando = false;

  ngOnInit(): void {
    this.carregarLancamentos();
  }

  carregarLancamentos(): void {
    this.carregando = true;
    this.apiService.listarLancamentos()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dados: Lancamento[]) => {
          this.dataSource = dados;
          this.carregando = false;
        },
        error: (err: unknown) => {
          this.carregando = false;
          this.mostrarNotificacao('Erro ao carregar os lançamentos do banco!');
          console.error(err);
        }
      });
  }

  editarLancamento(lancamento: Lancamento): void {
    // Aqui no futuro abrir o modal para edição do lançamento 
    this.mostrarNotificacao(`Abrir edição para: ${lancamento.descricao}`);
    console.log('Editar:', lancamento);
  }

  deletarLancamento(lancamento: Lancamento): void {
    if (!lancamento.idLancamento) return;

    if (confirm(`Tem certeza que deseja deletar o lançamento "${lancamento.descricao}"?`)) {
      this.apiService.deletarLancamento(lancamento.idLancamento)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.mostrarNotificacao('Lançamento deletado com sucesso!');
            this.carregarLancamentos(); // Atualiza a tabela dinamicamente
          },
          error: (err: unknown) => {
            this.mostrarNotificacao('Erro ao deletar lançamento do banco.');
            console.error(err);
          }
        });
    }
  }

  private mostrarNotificacao(mensagem: string): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
