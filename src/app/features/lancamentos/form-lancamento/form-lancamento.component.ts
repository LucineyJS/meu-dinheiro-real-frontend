import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';


// Imports do Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NovaCategoriaDialogComponent } from '../../categorias/nova-categoria-dialog/nova-categoria-dialog.component';
// Importação do serviço e das interfaces unificadas
import { ApiService } from '../../../core/services/api.service'; 
import { Categoria, Lancamento } from '../../../core/models/interfaces';

@Component({
  selector: 'app-form-lancamento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './form-lancamento.component.html',
  styleUrls: ['./form-lancamento.component.css']
})
export class FormLancamentoComponent implements OnInit {
  formLancamento!: FormGroup;
  categoriasFiltradas: Categoria[] = [];
  private todasCategorias: Categoria[] = [];

  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private apiService = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.initForm();
    this.carregarCategorias();

    // Filtra dinamicamente quando o usuário mudar o Tipo (RECEITA / DESPESA)
    this.formLancamento.get('tipo')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(tipo => {
        this.filtrarCategorias(tipo);
        this.formLancamento.get('idCategoria')?.setValue('');
      });
  }

  private initForm(): void {
    this.formLancamento = this.fb.group({
      descricao: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0.01)]],
      tipo: ['DESPESA', Validators.required],
      idCategoria: ['', Validators.required], // Alinhado com o nome da interface do lançamento
      status: ['EFETIVADO', Validators.required] // Valor padrão inicializado
    });
  }

  private carregarCategorias(): void {
    this.apiService.listarCategorias().subscribe({
      next: (dados: Categoria[]) => {
        this.todasCategorias = dados;
        this.filtrarCategorias(this.formLancamento.get('tipo')?.value);
      },
      error: (err: unknown) => console.error('Erro ao buscar categorias:', err)
    });
  }

  private filtrarCategorias(tipo: 'RECEITA' | 'DESPESA'): void {
    this.categoriasFiltradas = this.todasCategorias.filter(cat => cat.tipo === tipo);
  }

  onCategoriaSelection(valor: string | number): void {
    if (valor === 'NOVA_CATEGORIA') {
      this.abrirModalNovaCategoria();
    }
  }

private abrirModalNovaCategoria(): void {
  const tipoAtual = this.formLancamento.get('tipo')?.value || 'DESPESA';

  const dialogRef = this.dialog.open(NovaCategoriaDialogComponent, {
    width: '420px',
    data: { tipo: tipoAtual },
    disableClose: true
  });

  // 1. O modal agora vai retornar o Nome (string) ou undefined se cancelado
  dialogRef.afterClosed().subscribe((nomeDaCategoria: string | undefined) => {
    if (nomeDaCategoria) {
      
      // 2. Monta o objeto que o backend Spring Boot espera receber
      const novaCategoria: Partial<Categoria> = {
        nome: nomeDaCategoria,
        tipo: tipoAtual,
        icone: tipoAtual === 'RECEITA' ? 'trending_up' : 'trending_down' // ícone padrão sutil
      };

      // 3. Dispara a requisição HTTP para o backend salvar no MySQL
      this.apiService.criarCategoria(novaCategoria as Categoria).subscribe({
        next: (categoriaSalva: Categoria) => {
          // Adiciona a categoria salva (já com o id gerado pelo banco) na lista local
          this.todasCategorias.push(categoriaSalva);
          this.filtrarCategorias(tipoAtual);
          
          // Seleciona automaticamente a categoria recém-criada no formulário
          this.formLancamento.get('idCategoria')?.setValue(categoriaSalva.idCategoria);
          
          // Mostra a confirmação visual
          this.snackBar.open('Categoria criada com sucesso!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        },
        error: (err: unknown) => {
          console.error('Erro ao salvar categoria no banco:', err);
          this.snackBar.open('Erro ao salvar categoria.', 'Fechar', { duration: 3000 });
          this.formLancamento.get('idCategoria')?.setValue('');
        }
      });

    } else {
      // Se o usuário clicou em cancelar, limpa o select
      this.formLancamento.get('idCategoria')?.setValue('');
    }
  });
}

  salvarLancamento(): void {
    if (this.formLancamento.valid) {
      // Monta o payload idêntico ao esperado backend, incluindo o timestamp do exato momento
      const novoLancamento: Lancamento = {
        descricao: this.formLancamento.value.descricao,
        valor: this.formLancamento.value.valor,
        tipo: this.formLancamento.value.tipo,
        idCategoria: Number(this.formLancamento.value.idCategoria),
        status: this.formLancamento.value.status,
        dataLancamento: new Date().toISOString().split('.')[0] // Gera o formato perfeito: "2026-06-24T10:30:00"
      };

      this.apiService.criarLancamento(novoLancamento).subscribe({
        next: (resposta: Lancamento) => {
          console.log('Lançamento salvo com sucesso no banco de dados!', resposta);
          this.snackBar.open('Lançamento salvo com sucesso!', 'Fechar', { duration: 3000 });
          this.formLancamento.reset({ tipo: 'DESPESA', status: 'EFETIVADO' });
        

          Object.keys(this.formLancamento.controls).forEach(key => {
            const control = this.formLancamento.get(key);
            control?.setErrors(null);
            control?.markAsPristine();
            control?.markAsUntouched();
          });
        },
        error: (err: unknown) => console.error('Erro ao salvar lançamento:', err)
      });
    }
  }
}