import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nova-categoria-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
   templateUrl: './nova-categoria-dialog.component.html',
   styleUrls: ['./nova-categoria-dialog.component.css']
})
export class NovaCategoriaDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NovaCategoriaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tipo: 'RECEITA' | 'DESPESA' }
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  salvar(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.nome.trim());
    }
  }
}