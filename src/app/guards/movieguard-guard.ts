import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { map, take } from 'rxjs';

export const movieguardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.CurrentUser) {
    return true; // Connecté = passe
  } else {
    router.navigate(['/login']); // Non connecté = redirigé
    return false; // Bloqué
  }
};
