import { Component, Inject, OnInit, inject, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Imports do Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { ApiService } from '../../../core/services/api.service';
import { Categoria, Lancamento } from '../../../core/models/interfaces';

@Component({
  selector: 'app-editar-lancamento-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './editar-lancamento-dialog.component.html',
  styles: [`.w-full { width: 100%; margin-bottom: 8px; }`]
})
export class EditarLancamentoDialogComponent implements OnInit {
  form!: FormGroup;
  categoriasFiltradas: Categoria[] = [];
  private todasCategorias: Categoria[] = [];
  
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private dialogRef = inject(MatDialogRef<EditarLancamentoDialogComponent>);
  private destroyRef = inject(DestroyRef);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { lancamento: Lancamento }
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarCategoriasESetando();

    // Escuta mudanças de Tipo (RECEITA / DESPESA) dinamicamente dentro do modal
    this.form.get('tipo')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(novoTipo => {
        this.filtrarCategorias(novoTipo);
        // Só limpa o campo se o tipo selecionado for diferente do tipo original do lançamento
        if (novoTipo !== this.data.lancamento.tipo) {
          this.form.get('idCategoria')?.setValue('');
        }
      });
  }

  private initForm(): void {
    this.form = this.fb.group({
      descricao: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0.01)]],
      tipo: ['', Validators.required],
      idCategoria: ['', Validators.required]
    });
  }

  formatarAoPerderFoco(): void {
    let valorStr = this.form.get('valor')?.value;
    if (valorStr) {
      // Remove qualquer caractere que não seja número ou ponto/vírgula
      valorStr = valorStr.toString().replace(/[^0-9.,]/g, '');
      // Substitui vírgula por ponto para o parse numérico funcionar
      valorStr = valorStr.replace(',', '.');
      
      const valorNum = parseFloat(valorStr);
      if (!isNaN(valorNum)) {
        // Formata para o padrão brasileiro com 2 casas decimais
        const formatado = valorNum.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        this.form.get('valor')?.setValue(formatado, { emitEvent: false });
      }
    }
  }

 private carregarCategoriasESetando(): void {
  this.apiService.listarCategorias().subscribe({
    next: (dados: Categoria[]) => {
      this.todasCategorias = dados;
      const tipoAtual = this.data.lancamento.tipo;
      
      // 1. Filtra as categorias de acordo com o tipo (Receita ou Despesa)
      this.categoriasFiltradas = this.todasCategorias.filter(cat => cat.tipo === tipoAtual);

      // 2. Captura o ID da Categoria que agora vem com segurança do DTO
      const idProcurado = this.data.lancamento.idCategoria ? Number(this.data.lancamento.idCategoria) : null;

      // 3. Garante que a categoria atual está na lista filtrada (para evitar select em branco)
      if (idProcurado) {
        const categoriaExisteNaLista = this.categoriasFiltradas.some(cat => Number(cat.idCategoria) === idProcurado);

        if (!categoriaExisteNaLista) {
          const categoriaOriginal = this.todasCategorias.find(cat => Number(cat.idCategoria) === idProcurado);
          if (categoriaOriginal) {
            this.categoriasFiltradas.push(categoriaOriginal);
          }
        }
      }

      // 4. Formata o valor numérico para o input de dinheiro
      const valorNumerico = this.data.lancamento.valor ? Number(this.data.lancamento.valor) : 0;
      const valorFormatado = valorNumerico.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      // 5. Alimenta o formulário do Angular Material
      this.form.patchValue({
        descricao: this.data.lancamento.descricao,
        valor: valorFormatado,
        tipo: tipoAtual,
        idCategoria: idProcurado // 👈 Seta o ID numérico puro para o <mat-select> achar a opção correspondente
      });
    },
    error: (err: unknown) => console.error('Erro ao carregar categorias:', err)
  }); 
}

  private filtrarCategorias(tipo: 'RECEITA' | 'DESPESA'): void {
    this.categoriasFiltradas = this.todasCategorias.filter(cat => cat.tipo === tipo);
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  salvar(): void {
    if (this.form.valid) {
      // Converte a string "40,00" de volta para o número puro 40.00 esperado pelo banco
      let valorLimpo = this.form.value.valor.toString().replace(/\./g, '').replace(',', '.');
      const valorNumerico = parseFloat(valorLimpo);

      const lancamentoAtualizado: Lancamento = {
        ...this.data.lancamento,
        descricao: this.form.value.descricao,
        valor: valorNumerico,
        tipo: this.form.value.tipo,
        status: this.data.lancamento.status || 'EFETIVADO',
        idCategoria: Number(this.form.value.idCategoria),
        dataLancamento: this.data.lancamento.dataLancamento
      };

      this.dialogRef.close(lancamentoAtualizado);
    }
  }
}