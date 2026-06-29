import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // Signals modernos do Angular para controlar a visibilidade da senha
  esconderSenha = signal(true);
  esconderConfirmacao = signal(true);

  cadastroForm: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    senhaHash: ['', [Validators.required, Validators.minLength(4)]],
    confirmarSenha: ['', [Validators.required]]
  }, { 
    validators: this.passwordMatchValidator // Aplica o validador customizado no grupo
  });

  // Validador Customizado: Verifica se a senha e a confirmação são idênticas
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const senha = control.get('senhaHash');
    const confirmar = control.get('confirmarSenha');
    
    if (senha && confirmar && senha.value !== confirmar.value) {
      confirmar.setErrors({ passwordsDontMatch: true });
      return { passwordsDontMatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.cadastroForm.valid) {
      // Removemos o campo extra 'confirmarSenha' antes de enviar para a API de 8081
      const { nome, email, senhaHash } = this.cadastroForm.value;
      
      this.authService.cadastrar({ nome, email, senhaHash }).subscribe({
        next: () => {
          this.snackBar.open('Conta criada com sucesso! Redirecionando...', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.snackBar.open('Erro ao registrar usuário. Tente novamente.', 'Fechar', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
          console.error(err);
        }
      });
    }
  }
}