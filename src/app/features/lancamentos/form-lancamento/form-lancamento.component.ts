import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { ApiService } from '../../../core/services/api.service'; 

@Component({
  selector: 'app-form-lancamento',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule, 
    MatCardModule,
    CommonModule
  ],
  templateUrl: './form-lancamento.component.html'
})
export class FormLancamentoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);

  categorias: any[] = [];
  
  form: FormGroup = this.fb.group({
    descricao: ['', Validators.required],
    valor: ['', Validators.required],
    tipo: ['DESPESA', Validators.required],
    dataLancamento: [new Date().toISOString(), Validators.required], 
    status: ['EFETIVADO', Validators.required],
    idCategoria: ['', Validators.required]
  });

    ngOnInit() {
    this.carregarCategorias();
  }

   carregarCategorias() {
    this.api.listarCategorias().subscribe({
      next: (data: any) => {
        console.log('Dados da API:', data);
        this.categorias = data; // Armazena a resposta da API
      },
      error: (err) => console.error('Erro ao buscar categorias', err)
    });
  }

   onSubmit() {
    if (this.form.valid) {
      this.api.criarLancamento(this.form.value).subscribe({
        next: () => {
          alert('Lançamento registrado com sucesso!');
          this.form.reset(); // Limpa o formulário após salvar
        },
        error: (err) => {
          console.error('Erro ao salvar', err);
          alert('Erro ao salvar o lançamento. Verifique o console.');
        }
      });
    }
  }
}