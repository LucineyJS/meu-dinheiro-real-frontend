import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-lancamentos',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule],
  templateUrl: './lancamentos.component.html'
})
export class LancamentosComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  formLancamento: FormGroup = this.fb.group({
    valor: ['', Validators.required],
    descricao: ['', Validators.required],
    tipo: ['DESPESA', Validators.required],
    dataLancamento: [new Date().toISOString(), Validators.required],
    status: ['EFETIVADO', Validators.required],
    idCategoria: ['', Validators.required]
  });

  salvar() {
    if (this.formLancamento.valid) {
      this.http.post('http://localhost:8081/api/lancamento', this.formLancamento.value)
        .subscribe(() => alert('Lançamento salvo!'));
    }
  }
}