import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    // Clona a requisição adicionando o header Authorization
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // <--- O prefixo "Bearer " é obrigatório!
      }
    });
    return next(cloned);
  }

  return next(req);
};