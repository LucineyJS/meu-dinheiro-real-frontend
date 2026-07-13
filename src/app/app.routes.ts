import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  // Rotas Públicas
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'cadastro', 
    loadComponent: () => import('./features/auth/cadastro/cadastro.component').then(m => m.CadastroComponent) 
  },

  // Rotas Privadas (Protegidas pelo AuthGuard)
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component')
    .then(m => m.DashboardComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'categorias', 
    loadComponent: () => import('./features/categorias/categorias.component')
    .then(m => m.CategoriasComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'lancamentos/cadastro', 
    loadComponent: () => import('./features/lancamentos/form-lancamento/form-lancamento.component')
      .then(m => m.FormLancamentoComponent),
    canActivate: [authGuard] 
  },
    { 
    path: 'lancamentos/lista', 
    loadComponent: () => import('./features/lancamentos/lista-lancamentos/lista-lancamentos.component')
      .then(m => m.ListaLancamentosComponent),
    canActivate: [authGuard] 
  },  
  { 
    path: 'relatorios', 
    loadComponent: () => import('./features/relatorios/relatorios.component')
    .then(m => m.RelatoriosComponent),
    canActivate: [authGuard] 
  },

  // Redirecionamentos de Segurança
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
